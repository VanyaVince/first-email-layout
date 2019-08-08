import Model.Category;
import Model.Word;
import com.google.gson.Gson;
import com.google.gson.JsonParseException;
import com.qmetric.spark.authentication.AuthenticationDetails;
import com.qmetric.spark.authentication.BasicAuthenticationFilter;
import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.ModelAndView;
import spark.Request;
import spark.template.freemarker.FreeMarkerEngine;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static spark.Spark.*;

public class Main {

    private static final ObjectMapper mapper = new ObjectMapper();

    private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);

    private static boolean shouldReturnHTML(Request request) {
        String accept = request.headers("Accept");
        return accept != null && accept.contains("text/html");
    }

    private static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get("PORT") != null) {
            return Integer.parseInt(processBuilder.environment().get("PORT"));
        }
        return 4567; //return default port if heroku-port isn't set (i.e. on localhost)
    }

    public static void main(String[] args) {

        port(getHerokuAssignedPort());

        FreeMarkerEngine freeMarkerEngine = new FreeMarkerEngine();
        Configuration freeMarkerConfiguration = new Configuration();
        freeMarkerConfiguration.setTemplateLoader(new ClassTemplateLoader(sun.tools.jar.Main.class, "/templates/"));
        freeMarkerEngine.setConfiguration(freeMarkerConfiguration);

        staticFileLocation("/JsFrontend");


        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before(new BasicAuthenticationFilter("/path/*", new AuthenticationDetails("vanya", "tarakan123")));

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            if (shouldReturnHTML(request)) {
                response.type("text/html");
            } else {
                response.type("application/json");
            }
        });

        get("/", (request, response) -> {
            Map<String, Object> model = new HashMap<>();
            return freeMarkerEngine.render(new ModelAndView(model, "index.ftl"));
        });

        get("/getAllCategories", (req, res) -> {
            try {
                return new Gson().toJson(CategoryService.getAllCategories());
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        get("/category/:id", (req, res) -> {
            try {
                System.out.println(req.params(":id"));
                int idCategory = Integer.parseInt(req.params(":id"));
                return new Gson().toJson(WordService.getAllWords(idCategory));
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";

        });

        post("/addCategory", (req, res) -> {
            try {
                String request = req.body();
                Category newCategory = mapper.readValue(request, Category.class);
                System.out.println(newCategory);
                return new Gson().toJson(CategoryService.addCategory(newCategory));
            } catch (JsonParseException | JsonMappingException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";

        });

        post("/addWord", (req, res) -> {
            try {
                String request = req.body();
                Word word = mapper.readValue(request, Word.class);
                System.out.println(word.toString());
                return new Gson().toJson(WordService.addWord(word));
            } catch (JsonParseException | JsonMappingException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        post("/checkWords", (req, res) -> {
            try {
                String body = req.body();
                System.out.println(req.body());
                Map<Integer, List<Word>> checkWords = mapper.readValue(body, new TypeReference<Map<Integer, List<Word>>>() {
                });
                System.out.println(WordService.checkEnglishWords(checkWords));

                return new Gson().toJson(WordService.checkEnglishWords(checkWords));

            } catch (JsonParseException | JsonMappingException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        get("/shuffle", (req, res) -> {
            try {
                return new Gson().toJson(WordService.shuffleWords());
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        delete("/deleteCategory", (req, res) -> {
            try {
                String category = req.body();
                System.out.println(category);
                Category erasingCategory = mapper.readValue(category, Category.class);
                return new Gson().toJson(CategoryService.removeCategory(erasingCategory));
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        put("/editCategory", (req, res) -> {
            try {
                String category = req.body();
                System.out.println(category);
                Category word = mapper.readValue(category, Category.class);
                return new Gson().toJson(CategoryService.editCategory(word));
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        put("/editWord", (req, res) -> {
            try {
                String category = req.body();
                System.out.println(category);
                Word word = mapper.readValue(category, Word.class);
                return new Gson().toJson(WordService.editWord(word));
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });

        delete("/deleteWord", (req, res) -> {
            try {
                String category = req.body();
                System.out.println(category);
                Word erasingWord = mapper.readValue(category, Word.class);
                return new Gson().toJson(WordService.removeWord(erasingWord));
            } catch (JsonParseException e) {
                System.out.println(e.getMessage());
            }
            res.status(400);
            return "error";
        });
    }
}