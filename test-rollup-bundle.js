#!/usr/bin/env node

/**
 * Test script to reproduce Rollup v2.79.2 bundling issue
 * This script mimics how jsDelivr bundles packages with Rollup v2.79.2
 */

import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { join } from 'path';
import { readFileSync } from 'fs';

async function testBundle() {
  console.log('Testing bundle with Rollup v2.79.2 (jsDelivr version)...');
  
  try {
    // Read package.json to get entry point
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const entryPoint = packageJson.module || packageJson.main || './dist/index.js';
    
    console.log(`Entry point: ${entryPoint}`);
    
    // Create rollup bundle with similar config to jsDelivr
    const bundle = await rollup({
      input: entryPoint,
      external: [
        'react', 
        'react-dom', 
        'react/jsx-runtime',
        'fflate', 
        'manifold-3d', 
        'three', 
        'three-stdlib',
        'crypto'
      ], // Common externals for React components
      plugins: [
        nodeResolve({
          browser: true,
          preferBuiltins: false, // This is key - jsDelivr doesn't allow Node.js built-ins
        }),
      ],
      onwarn: (warning, warn) => {
        console.warn(`Warning: ${warning.message}`);
      },
    });

    const { output } = await bundle.generate({
      format: 'esm',
      exports: 'named',
    });

    console.log('✅ Bundle generated successfully!');
    console.log(`Output chunks: ${output.length}`);
    
    // Check for Node.js built-in imports in the output
    const nodeBuiltins = ['crypto', 'module', 'fs', 'path', 'os', 'util', 'stream', 'buffer', 'events'];
    let foundBuiltins = false;
    
    for (const chunk of output) {
      if (chunk.type === 'chunk') {
        for (const builtin of nodeBuiltins) {
          const patterns = [
            `require("${builtin}")`,
            `import "${builtin}"`,
            `from "${builtin}"`,
            `__require("${builtin}")`,
            `} from "${builtin}"`,
            `import { webcrypto as crypto2 } from "${builtin}"`
          ];
          
          for (const pattern of patterns) {
            if (chunk.code.includes(pattern)) {
              console.error(`❌ Found Node.js built-in "${builtin}" import in output!`);
              console.log('Problematic code snippet:');
              const lines = chunk.code.split('\n');
              lines.forEach((line, index) => {
                if (line.includes(`"${builtin}"`) || line.includes(`'${builtin}'`)) {
                  console.log(`Line ${index + 1}: ${line.trim()}`);
                }
              });
              foundBuiltins = true;
            }
          }
        }
      }
    }
    
    if (foundBuiltins) {
      console.error('\n❌ This bundle will FAIL on jsDelivr due to Node.js built-in imports!');
      process.exit(1);
    }

    await bundle.close();
    
  } catch (error) {
    console.error('❌ Bundle failed:', error.message);
    
    // Check if it's the specific jsDelivr error
    if (error.message.includes('not supported node.js built-in module "module"')) {
      console.error('This is the jsDelivr Rollup v2.79.2 error!');
    }
    
    process.exit(1);
  }
}

testBundle().catch(console.error);