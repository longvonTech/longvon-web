// Fail closed when GitHub environment protection cannot be independently verified.
const assert=require('node:assert/strict');
function verify(env){
 assert.equal(env.name,'production');
 const reviewers=env.protection_rules.find(r=>r.type==='required_reviewers');
 assert.ok(reviewers?.reviewers?.length>0,'Independent production reviewers required');
 assert.equal(reviewers.prevent_self_review,true,'Self review must be disabled');
 assert.equal(env.can_admins_bypass,false,'Admin bypass must be disabled');
 const policy=env.deployment_branch_policy;
 assert.ok(policy && (policy.protected_branches===true || policy.custom_branch_policies===true),'Production branch restrictions required');
 return true;
}
module.exports={verify};
if(require.main===module){verify(JSON.parse(require('fs').readFileSync(process.argv[2])));console.log('PRODUCTION_APPROVAL_CONTROLS_PASS')}
