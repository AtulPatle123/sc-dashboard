
class script_configure_install_project {

   def id_base_configuration = -1;
   def id_additionnal_configuration = -1;

   def name = "undefined";
   def files_folder = [];
   def preserve_every_file_folders = false;
   def is_s3_project_only = false;
   def blocs = [];

   final base_configuration_options = [
                                        [id:0, name:'AWS S3 WebSite and/or RDITS-Webstore Web Site',       files_folder:['project_files','s3_files'],                   blocs:['S3']],
                                        [id:1, name:'Tomcat 8 + Httpd Reverse Proxy + Java 1.8.0 Openjdk', files_folder:['project_files','httpd_files','tomcat_files'], blocs:['VM','TOMCAT','TOMCAT_8','HTTPD','HTTPD_RP','JAVA_OPENJDK']],
                                        [id:2, name:'Tomcat 8 + Httpd Reverse Proxy + Java 1.8.0 Oracle',  files_folder:['project_files','httpd_files','tomcat_files'], blocs:['VM','TOMCAT','TOMCAT_8','HTTPD','HTTPD_RP','JAVA_ORACLE']],
                                        [id:3, name:'Tomcat 7 + Httpd Reverse Proxy + Java 1.8.0 Openjdk', files_folder:['project_files','httpd_files','tomcat_files'], blocs:['VM','TOMCAT','TOMCAT_7','HTTPD','JAVA_OPENJDK']],
                                        [id:4, name:'Tomcat 7 + Httpd Reverse Proxy + Java 1.8.0 Oracle',  files_folder:['project_files','httpd_files','tomcat_files'], blocs:['VM','TOMCAT','TOMCAT_7','HTTPD','JAVA_ORACLE']],
                                        [id:5, name:'NodeJS 0.12 + Nginx Reverse Proxy',                   files_folder:['project_files','nodejs_files'],               blocs:['VM','NODEJS_012','NGINX']],
                                        [id:6, name:'All in!',                                             files_folder:['*'],                                          blocs:['VM', 'S3', '*']]
                                      ] ;

   final additionnal_config_options = [
                                        [id:0, name:'nothing',   files_folder:[], blocs:[]],
                                        [id:1, name:'MySQL 5.6', files_folder:[], blocs:['DB','MYSQL']],
                                        [id:2, name:'Mongo 3.2', files_folder:[], blocs:['DB','MONGO']],
                                        [id:3, name:'All in!',   files_folder:[], blocs:['DB','MYSQL','MONGO']]
                                      ] ;

   final filtered_file_pattern = ['src/readme.md',
                                  'src/main/resources/conf/.*.properties', 
                                  'src/site/markdown/.*.vm', 
                                  'src/main/resources/.*.sh', 
                                  'src/main/resources/project_files/bin/.*',
                                  'src/main/resources/tomcat_files/tomcat/bin/setenv.sh',
                                  'src/main/resources/nginx_files/.*.conf',
                                  'src/main/resources/httpd_files/.*.conf'
                                 ]; 
   
   def with_mysql,with_mongo = false;
   final mysql_bloc = "MYSQL"; 
   final mongo_bloc = "MONGO"; 
   
   /**
    * Main Method
    */
   private def script_configure_install_project(basepath) {

      try {

         def dir = null ;
         def file_to_be_deleted = [] ;
         def dir_to_be_deleted = [] ;
         def res = false ;

         /////////////////////////////////////////////////////////////////////////////
         // gather input

         def paramater_config = System.properties['CONFIG.ID'] ;
         if ( null != paramater_config ) {
            println("= Retrieve configuration information for Env Var CONFIG.ID=" + paramater_config );
            def i = paramater_config.indexOf(".");
            if ( -1 != i ){
               id_base_configuration = paramater_config.substring(0,i).toInteger() ;
               id_additionnal_configuration = paramater_config.substring(i+1).toInteger() ;
            }
            else {
               id_base_configuration = paramater_config.toInteger() ;
               id_additionnal_configuration = 0 ;
            }
         }
         else {
            get_input() ;
         }

         name = base_configuration_options[id_base_configuration].name ;
         files_folder = base_configuration_options[id_base_configuration].files_folder ;
         blocs = base_configuration_options[id_base_configuration].blocs ;
         def is_in = files_folder.findAll { it -> it == '*' } ;
         preserve_every_file_folders = ( 0 != is_in.size() );
         
         is_in = blocs.findAll { it -> it == 'VM' } ;
         is_s3_project_only = ( 0 == is_in.size() );
         
         if ( -1 != id_additionnal_configuration ) {
            additionnal_config_options[id_additionnal_configuration].blocs.each { bloc ->
               blocs << bloc ;
            }
         }

         println("Synthesis " );
         println("   CONFIG.ID=" + id_base_configuration + "." + id_additionnal_configuration );
         println("   [" + base_configuration_options[id_base_configuration].name + "] with [" + additionnal_config_options[id_additionnal_configuration].name + "]" );
         println("   files_folder=" + files_folder );
         println("   filter_blocs=" + blocs );
         println("   preserve_every_file_folders=" + preserve_every_file_folders );
         println("   Is S3 only=" + is_s3_project_only );

         /////////////////////////////////////////////////////////////////////////////
         // Removing useless files folders in src\main\resources\
         println("= Removing useless files folders" );
         dir = new File(basepath + "/src/main/resources") ;
         dir_to_be_deleted = [] ;
         dir.eachFileRecurse { file ->
            if ( false == preserve_every_file_folders && true == file.isDirectory() && true == file.getName().endsWith("_files")) {
               is_in = files_folder.findAll { it -> it == file.getName() } ;
               if ( 0 == is_in.size() ) {
                  dir_to_be_deleted.add(file.getPath()) ;
               }
            }
         }
         dir_to_be_deleted.each { path ->
            print ( "   - Removing folder " + path );
            res = new File(path).deleteDir()
            println ( " (ok?=$res)." );
         }

         /////////////////////////////////////////////////////////////////////////////
         // Removing useless mongo and mysql files folders in src\main\resources\project_files\[mongo|sql]
         println("= Removing useless [mongo|sql] folders" );
         dir_to_be_deleted = [] ;
         is_in = blocs.findAll { it -> it == 'MONGO' } ;
         if ( 0 == is_in.size() ) {
            dir_to_be_deleted.add(basepath + "/src/main/resources/project_files/mongo" ) ;
         }
         is_in = blocs.findAll { it -> it == 'MYSQL' } ;
         if ( 0 == is_in.size() ) {
            dir_to_be_deleted.add(basepath + "/src/main/resources/project_files/sql" ) ;
         }
         dir_to_be_deleted.each { path ->
            print ( "   - Removing folder " + path );
            res = new File(path).deleteDir()
            println ( " (ok?=$res)." );
         }

         /////////////////////////////////////////////////////////////////////////////
         // Configuring files for installation Docs
         println("= Configuring files for installation Docs" );
         if ( true == is_s3_project_only ) {
            
            ["site.xml", "installation_guide_pdf.xml", "complete_guide_pdf.xml"].each {
               
               def file_in = new File(basepath + "/src/site/S3.${it}") ;
               def file_out = new File(basepath + "/src/site/${it}") ;
               res = file_out.delete() ;
               println("   - Delete File src/site/${it} : " + res );
               res = file_in.renameTo(file_out);
               println("   - Rename File src/site/S3.${it} to  src/site/${it} : " + res );
            }
   
            dir = new File("src/site/markdown") ;
            file_to_be_deleted = [] ;
            dir.eachFileRecurse { file ->
               if ( false  == file.getName().startsWith("S3.")) {
                  file_to_be_deleted.add(file.getPath()) ;
               }
            }
            file_to_be_deleted.each { path ->
               print ( "   - Removing file " + path );
               res = new File(path).delete()
               println ( " (ok?=$res)." );
            }
         }
         else {
            dir = new File("src/site/markdown") ;
            file_to_be_deleted = [] ;
            dir.eachFileRecurse { file ->
               if ( true  == file.getName().startsWith("S3.")) {
                  file_to_be_deleted.add(file.getPath()) ;
               }
            }
            file_to_be_deleted.each { path ->
               print ( "   - Removing file " + path );
               res = new File(path).delete() ;
               println ( " (ok?=$res)." );
            }
         }

         /////////////////////////////////////////////////////////////////////////////
         // Filtering files folders in .
         println("= Filtering files folders" );
         dir = new File("src") ;
         dir.eachFileRecurse { file ->
            if ( true == file.isFile()) {
               def do_match = false ;
               filtered_file_pattern.eachWithIndex { pat, i ->
                  if (file.getPath() ==~ /${pat}/) {
                     do_match=true ;
                  }
               }
               if ( true == do_match ) {
                  filter_file(file.getPath()) ;
               }
            }
         }

         /////////////////////////////////////////////////////////////////////////////
         // Mark project as configured (via created file  .is_configured)
         println("= Mark project as configured (via created file  .is_configured)" );
         def outFile = new File(basepath + "/.is_configured") ;
         def PrintWriter fout = new PrintWriter(outFile) ;
         fout.println("configureation.id=" + id_base_configuration + "/" + id_additionnal_configuration );
         fout.println("configureation.name=[" + base_configuration_options[id_base_configuration].name + "] with [" + additionnal_config_options[id_additionnal_configuration].name + "]" );
         fout.println("configureation.files_folder=" + files_folder );
         fout.println("configureation.filterblocs=" + blocs );
         fout.close();

      } catch(ex) {
         def cause = ex.stackTrace ;
         def line = ex.stackTrace.find { it.fileName ==~ /^script_configure_install_project.groovy$/ } ;
         println "###Error : Message : " + ex.getMessage() ;
         println "###Error : Line    : " + line ;
         thow ex ;
      }

   }

   /**
    * Gather input to configure the instakll tool project 
    */
   void get_input( ) {
      // gather input
      println("= Retrieve configuration information" );
      id_base_configuration = retrieve_input_with_options('Choose Install configuration :', base_configuration_options, 1); 

      // Parsing information for MySQL or Mongo or other stuff...
      println("");
      id_additionnal_configuration = retrieve_input_with_options('Select Additionnal components :', additionnal_config_options, 0); 

      println("");
   }

   
   /**
    * Gather input to configure the instakll tool project 
    */
   void filter_file( filepath ) {

      println("   - Filtering File " + filepath + " with pattern " + blocs );

      def isMarkdownFile = filepath.endsWith(".md.vm") || filepath.endsWith(".md") ;
      def inFile = new File(filepath) ;
      def outFile = new File(filepath + ".new") ;
      def PrintWriter fout = new PrintWriter(outFile) ;
      def sep = "";
      def bloc_name = "" ;
      def bloc_value = "" ;
      def is_in = "" ;
      
      inFile.eachLine { line, lineNumber ->

         // Markdown file rely on pattern : ^[//]:[BLOC_NAME]
         if (true == isMarkdownFile && true == line.startsWith("[//]:[")) {
            sep = line.indexOf("]",6);
            bloc_name = line.substring(6,sep) ;
            bloc_value = line.substring(sep+1) ;
            is_in = blocs.findAll { it -> it == bloc_name } ;
            if ( 0 < is_in.size() ) {
               fout.println(bloc_value.trim()) ;
            }
         }
         
         // Other file rely on pattern : ^#[BLOC_NAME]
         else if (false == isMarkdownFile && true == line.startsWith("#[")) {
            sep = line.indexOf("]");
            bloc_name = line.substring(2,sep) ;
            bloc_value = line.substring(sep+1) ;
            is_in = blocs.findAll { it -> it == bloc_name } ;
            if ( 0 < is_in.size() ) {
               fout.println(bloc_value.trim()) ;
            }
         }
         else {
            fout.println(line) ;
         }
      }
      fout.close();

      //def backupFile =  new File(filepath+".bak") ;
      //def val = inFile.renameTo(backupFile);

      def newFile =  new File(filepath) ;
      def val = outFile.renameTo(newFile);
   }


   String retrieve_input(message, defaut_value) {
      def response = defaut_value ;
      def string_val = System.console().readLine( message + " [${defaut_value}] : ") ;
      if ( "" != string_val) {
         response = string_val.trim().charAt(0).toLowerCase().toString() ;
      }
      return response ;
    }

    int retrieve_input_with_options(message, options, defaut_value) {
      def response = false ;
      def message_with_option = message ;
      def i = 0 ;
      def val = -1 ;
      
      options.eachWithIndex { option, index ->
         i = index ;
         message_with_option += "\n   ${i} : " + option.name ;
      }
      message_with_option += "\n   select [${defaut_value}] : " ;
      def string_val = System.console().readLine( message_with_option ) ;
      if ( "" == string_val) {
         val = defaut_value.toInteger() ;
      }
      else {
         val = string_val.trim().toInteger() ;
      }
      return val ;
    }

}    
