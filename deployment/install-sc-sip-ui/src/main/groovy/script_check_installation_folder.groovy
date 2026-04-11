def contentPattern = /.*___.*/
def contentPattern_TBD = /.*TO_BE_DEFINED.*/
def nb_file = 0

println("      Browsing installation file : Search for text files that still need to be configured (.xml, .properties, .md, .md.vm, .txt, .conf and .sh)" )
new File(".").eachFileRecurse () { file ->
   if (
         ( false  == file.isDirectory() ) &&
         (
           ( true  == file.getName().endsWith(".xml") ) ||
           ( true  == file.getName().endsWith(".properties") ) ||
           ( true  == file.getName().endsWith(".md") ) ||
           ( true  == file.getName().endsWith(".md.vm") ) ||
           ( true  == file.getName().endsWith(".txt") ) ||
           ( true  == file.getName().endsWith(".conf") ) ||
           ( true  == file.getName().endsWith(".sh") )
         )
      ){
      file.eachLine { line, lineNumber ->
         if( true == line.matches(contentPattern)) {     
            println("      ! Warning : " + file.getName() + " :" + lineNumber + ": " + line )
            nb_file = nb_file + 1
         }
         else if( true == line.matches(contentPattern_TBD)) {     
            println("      ! Warning : " + file.getName() + " :" + lineNumber + ": " + line )
            nb_file = nb_file + 1
         }
      }
   }
}
println("      End of Search : " + nb_file + " file(s) found." )
