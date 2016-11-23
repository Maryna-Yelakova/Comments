var db = require("./connection");
var comments = function() {
    this.getComments = function (page) {
        var commentsOnPage = 5;
         var selectedPage = (page-1)*commentsOnPage;
            return db.query("select * from comments order by string_to_array(path::text,'.')::integer[] offset " + selectedPage + " limit " + commentsOnPage +";");
     };
    this.saveComment = function(newComment){
        var querytext = 'DO LANGUAGE plpgsql $$\n\ ' +
            '\tBEGIN\n\ '+
                '\t\tIF EXISTS (SELECT * FROM \"comments\")\n\ ' +
                '\t\tTHEN\n\ ' +
                    '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",\ ' +
                        '\"comment\",\"ip\",\"browser\",\"path\")\n\ ' +
                        '\t\t\t\tVALUES (\'' + newComment.name + '\',\'' + newComment.email +
                            '\',now(),\''+  newComment.baseurl + '\',\ ' +
                            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser + '\',\n\ ' +
                                '\t\t\t\t\t((SELECT (string_to_array(path::text,\'.\')::integer[])[1]\n\ '+
                                    '\t\t\t\t\t\tFROM \"comments\"\n\ ' +
                                    '\t\t\t\t\t\tORDER BY string_to_array(path::text,\'.\')::integer[]\n\ '+
                                    '\t\t\t\t\t\tDESC limit 1)+1)::text::ltree);\n\ '+
                '\t\tELSE\n\ '+
                    '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",\ ' +
                        '\"comment\",\"ip\",\"browser\",\"path\")\n\ '+
                        '\t\t\t\tVALUES (\'' + newComment.name + '\',\''+ newComment.email+
                            '\',now(),\''+ newComment.baseurl + '\',\ ' +
                            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser + '\',1::text::ltree);\n\ '+
                '\t\tEND IF;\n\ '+
            '\tEND;\n\ '+
        '$$;';
        return db.query(querytext);
    };
    this.getCommentsNumber = function(){
        return db.query("select count(*) from comments;");
    };

    this.addEnclosedComments = function(newComment){
        var querycommands = 'DO LANGUAGE plpgsql $$\n\ ' +
        '\tDECLARE ppath ltree := (SELECT \"path\" FROM \"comments\" WHERE id='+ newComment.id +');\n\ '+
        '\tBEGIN\n\ '+
            '\t\tIF EXISTS (SELECT * FROM \"comments\" WHERE (\"path\" <@ ppath) AND (\"path\" <> ppath) limit 1)\n\ '+
            '\t\tTHEN\n\ ' +
               '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",' +
                '\"comment\",\"ip\",\"browser\",\"path\")\n\ ' +
                '\t\t\t\tVALUES (\'' + newComment.name + '\',\'' + newComment.email +
                  '\',now(),\''+  newComment.baseurl + '\',' +
                  '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browse +'\','+
            '(ppath::text\n\ ' +
            '|| \'.\' || ((SELECT (string_to_array(path::text,\'.\')::integer[])['+
            '(array_length(string_to_array(ppath::text,\'.\'), 1) + 1)]\n\ '+
            '\t\t\t\t\t\tFROM \"comments\"\n\ ' +
            '\t\t\t\t\t\tWHERE \"path\" <@ ppath\ '+
            'ORDER BY string_to_array(path::text,\'.\')::integer[]\n\ '+
            '\t\t\t\t\t\tDESC LIMIT 1) + 1)::text)::ltree);\n\ '+
            '\t\tELSE\n\ '+
            '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",' +
            '\"comment\",\"ip\",\"browser\",\"path\")\n\ '+
            '\t\t\t\tVALUES (\'' + newComment.name + '\',\''+ newComment.email+
            '\',now(),\''+ newComment.baseurl + '\',' +
            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser +'\','+
            '(ppath::text ||'+ '\'.1\'' +')::ltree);\n\ '+
            '\t\tEND IF;\n\ '+
            '\tEND;\n\ '+
            '$$;';
        return db.query(querycommands);
    }
};
module.exports = comments;