class script_set_project_properties {

    private def script_set_project_properties(properties, artifactoryBaseDir, groupId, artifactId, version) {
        
        println("       Gather build information to build readme and release notes files" )
        def artifactoryDocUrl = artifactoryBaseDir + groupId.replace('.', '/') + "/" + artifactId + "/" + version + "/" + artifactId + "-" + version + "-doc.tar.gz"
        def artifactoryBinUrl = artifactoryBaseDir + groupId.replace('.', '/') + "/" + artifactId + "/" + version + "/" + artifactId + "-" + version + ".tar.gz"
        
        properties.setProperty("versionWithoutSnapshotSuffix", version.replace('-SNAPSHOT', ''))
        properties.setProperty("artifactoryTargetDocUrl", artifactoryDocUrl.replaceAll("-SNAPSHOT",""))
        properties.setProperty("artifactoryTargetBinUr", artifactoryBinUrl.replaceAll("-SNAPSHOT",""))

        
        if ( true == version.endsWith('-SNAPSHOT')) {
           properties.setProperty("artifactoryRealDocUrl", "n/a (no release for snapshot version)")
           properties.setProperty("artifactoryRealBinUrl", "n/a (no release for snapshot version)")
        } else {
           properties.setProperty("artifactoryRealDocUrl", artifactoryDocUrl)
           properties.setProperty("artifactoryRealBinUrl", artifactoryBinUrl)
        }
        
        
        File f = new File("/usr/local/git/bin/git");
        if( true == f.exists() && true == f.canExecute()) 
        { 
           def p = "/usr/local/git/bin/git config --get remote.origin.url".execute()
           p.waitFor()
           properties.setProperty("scmUrl", p.text.trim())
           
           p = "/usr/local/git/bin/git rev-parse --abbrev-ref HEAD".execute()
           p.waitFor()
           properties.setProperty("scmBranch", p.text.trim())
           
           p = "/usr/local/git/bin/git describe --tags".execute()
           p.waitFor()
           properties.setProperty("scmTag", p.text.trim())
           
           p = "/usr/local/git/bin/git rev-parse --verify HEAD".execute()
           p.waitFor()
           properties.setProperty("scmRev", p.text.trim())
           
           p = "/usr/local/git/bin/git status --porcelain".execute()
           p.waitFor()
           def scmDiff = ""
           p.text.eachLine {if ( false == it.contains("/target/")) {scmDiff = scmDiff + it + "\n"}}
           properties.setProperty("scmDiff", scmDiff )
        }
        else
        {
           properties.setProperty("scmUrl", "not available" )
           properties.setProperty("scmBranch", "not available" )
           properties.setProperty("scmTag", "not available" )
           properties.setProperty("scmRev", "not available" )
           properties.setProperty("scmDiff", "not available" )
        }
        
        def addr = InetAddress.getLocalHost();
        properties.setProperty("localHost", addr.getHostName())
        properties.setProperty("localIP", addr.getHostAddress())

        java.net.InetAddress[] addresses=InetAddress.getAllByName(addr.getHostName());
        for (address in addresses) {
           if (false == (address.getHostAddress().startsWith("0"))) {
              properties.setProperty("localIP", address.getHostAddress())
           }
        }

        println("       Extended Project Propeties : " + properties.toString().replaceAll("\n", " ") )
        
    }
}  



