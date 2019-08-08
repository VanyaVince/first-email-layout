package Model;

public class Word {

    private int id;
    private String englishWord;
    private String russianWord;
    private int id_category;

    public Word(int id, String englishWords, String russianWords, int id_category) {
        this.id =id;
        this.englishWord = englishWords;
        this.russianWord = russianWords;
        this.id_category = id_category;
    }

    public Word() {
    }

    public int getId() {
        return id;
    }

    public String getEnglishWord() {
        return englishWord;
    }

    public String getRussianWord() {
        return russianWord;
    }

    public int getId_category() { return id_category;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setEnglishWord(String englishWord) {
        this.englishWord = englishWord;
    }

    public void setRussianWord(String russianWord) {
        this.russianWord = russianWord;
    }

    public int setType(int type) { this.id_category = type; return type; }

    @Override
    public String toString() {
        return "id=" + id +
                ", englishWord='" + englishWord + '\'' +
                ", russianWord='" + russianWord + '\'' +
                ", id_category=" + id_category +
                '}';
    }
}