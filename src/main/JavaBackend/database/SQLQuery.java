package database;

public class SQLQuery {

    public static final String foreignKeyChecks = "SET FOREIGN_KEY_CHECKS =0";

    ////CATEGORIES////
    public static final String getAllCategory = "SELECT * FROM CATEGORIES";
    public static final String getAll2Category = "SELECT FROM CATEGORIES WHERE categoryID = (LAST_INSERT_ID())";
    public static final String insertNewCategory = "INSERT INTO CATEGORIES (categoryName) VALUES (?)";
    public static final String deleteCategory = "DELETE FROM categories WHERE categoryID = ?";
    public static final String deleteFromCommonTableCategory = "DELETE FROM word_category WHERE categories_id = ?";
    public static final String editCategory = "UPDATE categories " + " SET categoryName = ? " + " WHERE categoryID = ?";

    ////WORD////
    public static final String getWordsByIdCategory = "select words.wordsID ,englishWords, russianWords from word_category " +
            "inner join words on words_id = wordsID where word_category.categories_id = ";

    public static final String insertNewWord = "INSERT INTO WORDS (englishWords, russianWords) VALUES (?, ?)";

    public static final String lastWordId = "SELECT currval(pg_get_serial_sequence('words','wordsid'))";

    public static final String insertToCommonTable = "INSERT INTO word_category (words_id,categories_id) VALUES(LASTVAL(), ?)";

    public static final String insertCommonTable = "INSERT INTO word_category (words_id,categories_id) VALUES(?, ?)";

    public static final String getAllWords = "SELECT * FROM WORDS";

    public static final String editWord = "UPDATE words " + " SET englishWords = ?, russianWords = ? " + " WHERE wordsID = ?";

    public static final String editWordInCommonTable = "UPDATE word_category " + " SET words_id = ? " + " WHERE words_id = ? and categories_id = ?";

    public static final String deleteWord = "DELETE FROM word_category WHERE words_id = ? and categories_id = ?";
}