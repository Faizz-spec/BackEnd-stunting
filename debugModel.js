const tf = require('@tensorflow/tfjs');

async function inspectModel() {
  const model = await tf.loadGraphModel('http://localhost:3000/public/ml-model/model/model.json');

  console.log('Model Signature:', model.signature);

  console.log('\nInput(s):');
  model.inputs.forEach((input, i) => {
    console.log(`  [${i}] name: ${input.name}, shape: ${input.shape}, dtype: ${input.dtype}`);
  });

  console.log('\nOutput(s):');
  model.outputs.forEach((output, i) => {
    console.log(`  [${i}] name: ${output.name}, shape: ${output.shape}, dtype: ${output.dtype}`);
  });
}

inspectModel().catch(err => console.error(err));
