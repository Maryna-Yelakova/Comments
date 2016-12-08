var db = require("./connection");
var comments = function() {
    this.getComments = function (page) {
        var commentsOnPage = 5;
        var selectedPage = (page-1)*commentsOnPage;
            return db.query('select \"id\",\"name\",\"email\",\"date\",\"baseurl\",\ ' +
                '\"comment\",\"attachment\", array_length(string_to_array(path::text,\'.\'), 1) from comments order by string_to_array(path::text,\'.\')::integer[] offset ' + selectedPage + ' limit ' + commentsOnPage +';');
     };
    this.saveComment = function(newComment){
        var querytext = 'DO LANGUAGE plpgsql $$\n\ ' +
            '\tBEGIN\n\ '+
                '\t\tIF EXISTS (SELECT * FROM \"comments\")\n\ ' +
                '\t\tTHEN\n\ ' +
                    '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",\ ' +
                        '\"comment\",\"ip\",\"browser\",\"attachment\",\"path\")\n\ ' +
                        '\t\t\t\tVALUES (\'' + newComment.name + '\',\'' + newComment.email +
                            '\',now(),\''+  newComment.baseurl + '\',\ ' +
                            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser +
                              '\',\'' + newComment.attachment + '\',\n\ ' +
                                '\t\t\t\t\t((SELECT (string_to_array(path::text,\'.\')::integer[])[1]\n\ '+
                                    '\t\t\t\t\t\tFROM \"comments\"\n\ ' +
                                    '\t\t\t\t\t\tORDER BY string_to_array(path::text,\'.\')::integer[]\n\ '+
                                    '\t\t\t\t\t\tDESC limit 1)+1)::text::ltree);\n\ '+
                '\t\tELSE\n\ '+
                    '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",\ ' +
                        '\"comment\",\"ip\",\"browser\",\"attachment\",\"path\")\n\ '+
                        '\t\t\t\tVALUES (\'' + newComment.name + '\',\''+ newComment.email+
                            '\',now(),\''+ newComment.baseurl + '\',\ ' +
                            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser +
                        '\',\'' + newComment.attachment + '\',1::text::ltree);\n\ '+
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
                '\"comment\",\"ip\",\"browser\",\"attachment\",\"path\")\n\ ' +
                '\t\t\t\tVALUES (\'' + newComment.name + '\',\'' + newComment.email +
                  '\',now(),\''+  newComment.baseurl + '\',' +
                  '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser + '\',\'' + newComment.attachment + '\','+
            '(ppath::text\n\ ' +
            '|| \'.\' || ((SELECT (string_to_array(path::text,\'.\')::integer[])['+
            '(array_length(string_to_array(ppath::text,\'.\'), 1) + 1)]\n\ '+
            '\t\t\t\t\t\tFROM \"comments\"\n\ ' +
            '\t\t\t\t\t\tWHERE \"path\" <@ ppath\ '+
            'ORDER BY string_to_array(path::text,\'.\')::integer[]\n\ '+
            '\t\t\t\t\t\tDESC LIMIT 1) + 1)::text)::ltree);\n\ '+
            '\t\tELSE\n\ '+
            '\t\t\tINSERT INTO \"comments\" (\"name\",\"email\",\"date\",\"baseurl\",' +
            '\"comment\",\"ip\",\"browser\",\"attachment\",\"path\")\n\ '+
            '\t\t\t\tVALUES (\'' + newComment.name + '\',\''+ newComment.email+
            '\',now(),\''+ newComment.baseurl + '\',' +
            '\'' + newComment.text + '\',\'' + newComment.ip + '\',\'' + newComment.browser + '\',\'' + newComment.attachment + '\','+
            '(ppath::text ||'+ '\'.1\'' +')::ltree);\n\ '+
            '\t\tEND IF;\n\ '+
            '\tEND;\n\ '+
            '$$;';
        return db.query(querycommands);
    };
    this.getSortComments = function(sortparam,arrow,page){
        var commentsOnPage = 5;
        var selectedPage = (page-1)*commentsOnPage;
        var querycommand = 'WITH tmptable AS (SELECT ' +  sortparam + ' as ord, path FROM comments\n\ '+
            '\t\t\t\tWHERE array_length(string_to_array(path::text, \'.\'),1)=1)\n\ '+
        'SELECT  id, name, email, date, baseurl, ' +
            'comment, attachment, array_length(string_to_array(comments.path::text,\'.\'), 1), tmptable.path, ord FROM comments LEFT JOIN tmptable\n\ '+
        'ON (string_to_array(comments.path::text, \'.\')::integer[])[1] = tmptable.path::text::integer\n\ '+
        'ORDER BY ord ' + arrow  + ', string_to_array(comments.path::text,\'.\')::integer[] ASC offset ' + selectedPage + ' limit ' + commentsOnPage +';';
        return db.query(querycommand);
    }
};
module.exports = comments;