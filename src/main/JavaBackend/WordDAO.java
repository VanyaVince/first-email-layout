import Model.Word;
import database.DBConnection;
import database.SQLQuery;

import java.sql.*;
import java.util.*;

public class WordDAO {

    private DBConnection dbConnection = new DBConnection();

    public List<Word> findAllWordsByIdCategory(int idCategory) {

        List<Word> wordsCollection = new ArrayList<>();

        //dbConnection.setDriverManager();
        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.getWordsByIdCategory + idCategory);
        dbConnection.getResultSet();

        if (retrieve(wordsCollection)) {
            return wordsCollection;
        }
        return null;
    }

    public synchronized void saveWord(Word word) {

        try {
            // dbConnection.setDriverManager();
            dbConnection.setConnection();

            word.setEnglishWord(word.getEnglishWord().toLowerCase().trim());
            word.setRussianWord(word.getRussianWord().trim());

            dbConnection.setPreparedStatement(SQLQuery.insertNewWord);
            dbConnection.preparedStatement.setString(1, word.getEnglishWord());
            dbConnection.preparedStatement.setString(2, word.getRussianWord());
            dbConnection.preparedStatement.execute();

            dbConnection.setPreparedStatement(SQLQuery.insertToCommonTable);
            dbConnection.preparedStatement.setInt(1, word.getId_category());
            dbConnection.preparedStatement.execute();

            dbConnection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Word findWordInCommonTable(Word searchingWord) {

        List<Word> wordsCollection = findAllWordsByIdCategory(searchingWord.getId_category());
        for (Word word : wordsCollection) {
            if (word.getEnglishWord().equals(searchingWord.getEnglishWord()) && word.getRussianWord().equals(searchingWord.getRussianWord())) {
                return word;
            }
        }
        return null;
    }

    public List<Word> findAllWordsOfUser() {

        List<Word> wordsOfUsers = new ArrayList<>();

        //dbConnection.setDriverManager();
        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.getAllWords);
        dbConnection.getResultSet();

        if (retrieve(wordsOfUsers)) {
            return wordsOfUsers;
        }
        return null;
    }

    public Word allWordsOfUser(Word searchingWord) {

        List<Word> wordsCollection = findAllWordsOfUser();

        for (Word word : wordsCollection) {
            if (searchingWord.getEnglishWord().equals(word.getEnglishWord()) && searchingWord.getRussianWord().equals(word.getRussianWord())) {
                return word;
            }
        }
        return null;
    }

    public void putInCommonTable(int idWord, int idCategory) {
        try {
            dbConnection.setConnection();
            //dbConnection.disableChecksForForeignKey();

            dbConnection.setPreparedStatement(SQLQuery.insertCommonTable);
            dbConnection.preparedStatement.setInt(1, idWord);
            dbConnection.preparedStatement.setInt(2, idCategory);
            dbConnection.preparedStatement.execute();

            dbConnection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void editWordInCommonTable (Word editingWord, Word existingWord){
        try {
            dbConnection.setConnection();

            dbConnection.setPreparedStatement(SQLQuery.editWordInCommonTable);
            dbConnection.preparedStatement.setInt(1, existingWord.getId());
            dbConnection.preparedStatement.setInt(2, editingWord.getId());
            dbConnection.preparedStatement.setInt(3, editingWord.getId_category());
            dbConnection.preparedStatement.executeUpdate();

            dbConnection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void editWord (Word word){
        try {
            dbConnection.setConnection();

            dbConnection.setPreparedStatement(SQLQuery.editWord);
            dbConnection.preparedStatement.setString(1, word.getEnglishWord());
            dbConnection.preparedStatement.setString(2, word.getRussianWord());
            dbConnection.preparedStatement.setInt(3, word.getId());
            dbConnection.preparedStatement.executeUpdate();

            dbConnection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Word deleteWord(Word word) {

        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.deleteWord);

        try {
            dbConnection.preparedStatement.setInt(1, word.getId());
            dbConnection.preparedStatement.setInt(2, word.getId_category());
            dbConnection.preparedStatement.execute();
            dbConnection.closeConnection();
            return word;

        } catch (SQLException e) {
            e.printStackTrace();
        } return null;
    }

    private boolean retrieve(List<Word> wordsOfUsers) {

        try {
            while (dbConnection.resultSet.next()) {
                Word word = new Word();
                word.setId(dbConnection.resultSet.getInt("wordsID"));
                word.setEnglishWord(dbConnection.resultSet.getString("englishWords"));
                word.setRussianWord(dbConnection.resultSet.getString("russianWords"));
                wordsOfUsers.add(word);
            }
            dbConnection.closeConnection();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }


    public Map<Integer, Word> getWordsForChecking(int idCategory) {

        Map<Integer, Word> wordsCollection = new LinkedHashMap<>();

        //dbConnection.setDriverManager();
        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.getWordsByIdCategory + idCategory);
        dbConnection.getResultSet();

        try {
            while (dbConnection.resultSet.next()) {
                Word word = new Word();
                word.setId(dbConnection.resultSet.getInt("wordsID"));
                word.setEnglishWord(dbConnection.resultSet.getString("englishWords"));
                word.setRussianWord(dbConnection.resultSet.getString("russianWords"));
                wordsCollection.put(word.getId(), word);
            }
            dbConnection.closeConnection();
            return wordsCollection;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}