#!groovy
import jenkins.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.common.*
import com.cloudbees.plugins.credentials.domains.*
import com.cloudbees.plugins.credentials.impl.*
import hudson.util.Secret

def instance = Jenkins.getInstance()
def domain = Domain.global()
def store = instance.getExtensionList('com.cloudbees.plugins.credentials.SystemCredentialsProvider')[0].getStore()

def username = "{{ dockerhub_user }}"
def password = "{{ dockerhub_pass }}"
def description = "Docker Hub Credentials"

// Determine ID automatically or start fresh
def id = "dockerhub-credentials"

def nbCredentials = 0
store.getCredentials(domain).each {
    if (it.description == description) {
        nbCredentials++
    }
}

if (nbCredentials == 0) {
    def credentials = new UsernamePasswordCredentialsImpl(
        CredentialsScope.GLOBAL,
        id,
        description,
        username,
        password
    )
    store.addCredentials(domain, credentials)
    println "Docker Hub Credentials added."
} else {
    println "Docker Hub Credentials already exist."
}
instance.save()
