import Model.Word;

import java.util.*;

class WordService {

    private static WordDAO wordDAO = new WordDAO();
    private static List<Word> serviceList = new ArrayList<>();

    public static List<Word> getAllWords(int idCategory) {
        cleanServiceList(serviceList);
        serviceList = wordDAO.findAllWordsByIdCategory(idCategory);
        System.out.println(serviceList.toString());
        return serviceList;
    }

    public static List<Word> addWord(Word addedWord) {

        Word wordsOfUser = wordDAO.allWordsOfUser(addedWord);
        Word wordsInCommonTable = wordDAO.findWordInCommonTable(addedWord);

        if (wordsOfUser == null) {
            cleanServiceList(serviceList);
            wordDAO.saveWord(addedWord);
            serviceList = wordDAO.findAllWordsByIdCategory(addedWord.getId_category());
            return serviceList;
        } else {
            if (wordsInCommonTable != null) {
                return null;
            }
            wordDAO.putInCommonTable(wordsOfUser.getId(), addedWord.getId_category());
            cleanServiceList(serviceList);
            serviceList = wordDAO.findAllWordsByIdCategory(addedWord.getId_category());
        }
        return serviceList;
    }

    static List<Word> shuffleWords() {
        Collections.shuffle(serviceList);
        return serviceList;
    }

    private static void cleanServiceList(List<Word> list) {
        list.clear();
    }

    public static Word editWord(Word editingWord) {

        Word existingWordInTheCategory = wordDAO.findWordInCommonTable(editingWord);

        Word existingWord = wordDAO.allWordsOfUser(editingWord);

        if (existingWordInTheCategory != null) {
            return null;
        }

        if (existingWord != null) {
            wordDAO.editWordInCommonTable(editingWord, existingWord);
            return editingWord;
        } else
            wordDAO.editWord(editingWord);
        return editingWord;
    }

    public static Word removeWord(Word word) {
        return wordDAO.deleteWord(word);
    }


    static Map<Integer, Boolean> checkEnglishWords(Map<Integer, List<Word>> deliveredWords) {

        int idCategory = deliveredWords.keySet().stream().findFirst().get();
        ArrayList<Word> wordOfUser = new ArrayList<>(deliveredWords.get(idCategory));
        Map<Integer, Word> wordsCollection = wordDAO.getWordsForChecking(idCategory);
        System.out.println(wordsCollection.size());
        Map<Integer, Boolean> checkedWords = new LinkedHashMap<>();

        for (int i = 0; i < wordOfUser.size(); i++)
            if (wordOfUser.get(i).getEnglishWord().toLowerCase().trim().contains(wordsCollection.get(wordOfUser.get(i).getId()).getEnglishWord())) {
                checkedWords.put(wordsCollection.get(wordOfUser.get(i).getId()).getId(), true);
            } else {
                checkedWords.put(wordsCollection.get(wordOfUser.get(i).getId()).getId(), false);
            }
        return checkedWords;
    }
}