const Lookup = require('../models/lookup');

function pad4(strOrNum) {
  return String(strOrNum).padStart(4, '0');
}

function incrementAlphaNum(str) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = str.split('');
  for (let i = result.length - 1; i >= 0; i--) {
    const index = chars.indexOf(result[i]);
    if (index < chars.length - 1) {
      result[i] = chars[index + 1];
      return result.join('');
    } else {
      result[i] = '0';
    }
  }
  return '0000';
}

async function getNextSequenceAndAlphaNum() {
  const seqDoc = await Lookup.findOne({ key: 'globalSequence' });
  const alphaDoc = await Lookup.findOne({ key: 'globalAlpha' });

  let sequence = seqDoc?.value || 0;
  let total = seqDoc?.total || 0;
  let alpha = alphaDoc?.value || '0000';

  if (sequence >= 9999) {
    sequence = 0;
    alpha = incrementAlphaNum(alpha);
    await Lookup.updateOne(
      { key: 'globalAlpha' },
      { $set: { value: alpha } },
      { upsert: true }
    );
  }

  sequence += 1;
  total += 1;

  await Lookup.updateOne(
    { key: 'globalSequence' },
    { $set: { value: sequence }, $inc: { total: 1 } },
    { upsert: true }
  );

  return { alphaNum: alpha, sequence: pad4(sequence) };
}

function getCurrentYYMM() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  return yy + mm;
}

async function generateLoanID(loanTypeCode) {
  if (!['P', 'V', 'O'].includes(loanTypeCode)) {
    throw new Error('Invalid loan type code. Use P, V, or O.');
  }

  const { alphaNum, sequence } = await getNextSequenceAndAlphaNum();
  const dateYYMM = getCurrentYYMM();
  return `${loanTypeCode}${alphaNum}${dateYYMM}${sequence}`;
}

// Utility: initialize or reset global sequence and alpha
async function resetLookupState() {
  await Lookup.updateOne({ key: 'globalSequence' }, { $set: { value: 0 } }, { upsert: true });
  await Lookup.updateOne({ key: 'globalAlpha' }, { $set: { value: '0000' } }, { upsert: true });
  console.log('Global sequence and alpha have been reset.');
}

module.exports={
  generateLoanID
}