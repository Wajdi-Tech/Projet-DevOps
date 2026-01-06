#!groovy
import jenkins.model.*
import org.jenkinsci.plugins.workflow.job.WorkflowJob
import org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition
import hudson.plugins.git.GitSCM
import hudson.plugins.git.UserRemoteConfig
import hudson.plugins.git.BranchSpec

def jobName = "DevOps-Project-Pipeline"
def repoUrl = "{{ repo_url }}" // Injected via Ansible
def scriptPath = "Jenkinsfile"

// Get Jenkins Instance
def instance = Jenkins.getInstance()

// Check if job exists
if (instance.getItem(jobName) == null) {
    println "Creating job ${jobName}..."
    
    // Create Job
    WorkflowJob job = instance.createProject(WorkflowJob.class, jobName)
    
    // Define SCM (Git)
    def scm = new GitSCM(
        [new UserRemoteConfig(repoUrl, null, null, null)],
        [new BranchSpec("*/main")], // Or */master, will detect
        false, 
        Collections.<hudson.plugins.git.SubmoduleConfig>emptyList(), 
        null, 
        null, 
        Collections.<hudson.plugins.git.extensions.GitSCMExtension>emptyList()
    )
    
    // Define Flow Definition
    def flowDefinition = new CpsScmFlowDefinition(scm, scriptPath)
    flowDefinition.setLightweight(true) // Lightweight checkout
    
    // Set Definition
    job.setDefinition(flowDefinition)
    
    // Save
    job.save()
    println "Job ${jobName} created successfully."
    
    // Schedule Build (Optional)
    // instance.queue.schedule(job)
} else {
    println "Job ${jobName} already exists."
}
