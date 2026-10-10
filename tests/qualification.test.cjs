const { test } = require('node:test')
const assert = require('node:assert/strict')
const { load } = require('./load-ts.cjs')
const { qualifyLead, parseBudget } = load('lib/qualification.ts')
const { DEFAULT_QUESTIONS: questions } = load('lib/forms.ts')
const answers = { trigger:'A new website', budget:'5k-10k', timeline:'1 month', decision_maker:'I decide', service:'Website design' }
const qualify = (patch, policy = {}) => qualifyLead({...answers,...patch},questions,{minBudget:3000,...policy})
test('500 dollars and a range crossing the minimum are never high-budget matches', () => {
  assert.equal(qualify({budget:'$500'}).qualificationStatus,'not_a_fit')
  assert.equal(qualify({budget:'$1k-$5k'}).qualificationStatus,'manual_review')
})
test('negated owner statement does not establish authority', () => {
  assert.equal(qualify({decision_maker:'I am not the owner'}).qualificationStatus,'manual_review')
})
test('default one-month timeline is recognized; no verbosity bonus', () => {
  assert.equal(qualify({}).qualificationStatus,'ready_to_book')
  assert.deepEqual(qualify({trigger:'x'}),qualify({trigger:'x'.repeat(1000)}))
})
test('hard rejection cannot be promoted by relaxed scoring thresholds', () => {
  const result=qualify({budget:'<1k'},{goldThreshold:10,silverThreshold:5,minBudget:1000})
  assert.equal(result.badge,'Bronze'); assert.equal(result.qualificationStatus,'not_a_fit')
})
test('exclusive bounds, currencies, and malformed budgets', () => {
  assert.deepEqual(parseBudget('<$1k'),{min:0,max:1000,maxInclusive:false})
  assert.equal(qualify({budget:'<=3000'}).qualificationStatus,'manual_review')
  assert.equal(parseBudget('USD 5000','KES'),null)
  assert.deepEqual(parseBudget('KES 100,000','KES'),{min:100000,max:100000,maxInclusive:true})
  for (const value of ['not sure','5k-1k','NaN','1k/5k','5000000 words']) assert.equal(parseBudget(value),null)
})
test('missing minimum or unknown criteria require clarification', () => {
  assert.equal(qualify({},{minBudget:null}).qualificationStatus,'manual_review')
  assert.equal(qualify({timeline:'maybe next year'}).qualificationStatus,'manual_review')
  assert.equal(qualify({service:'Other / not sure'},{supportedServices:['Website design']}).qualificationStatus,'manual_review')
  assert.equal(qualify({service:'E-commerce'},{supportedServices:['Website design']}).qualificationStatus,'not_a_fit')
})
