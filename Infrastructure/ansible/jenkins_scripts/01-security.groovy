#!groovy
import jenkins.model.*
import hudson.security.*

def instance = Jenkins.getInstance()

if (instance.getSecurityRealm() instanceof HudsonPrivateSecurityRealm) {
    println "Security Realm already set."
} else {
    println "Setting Security Realm to HudsonPrivateSecurityRealm..."
    def hudsonRealm = new HudsonPrivateSecurityRealm(false)
    hudsonRealm.createAccount("admin", "admin") // User / Pass
    instance.setSecurityRealm(hudsonRealm)
    
    def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
    strategy.setAllowAnonymousRead(false)
    instance.setAuthorizationStrategy(strategy)
    
    instance.save()
    println "Admin user created and security configured."
}
