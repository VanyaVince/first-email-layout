import Model.Category;
import database.SQLQuery;

import java.util.List;

public class CategoryService {

    private static CategoryDAO categoryDAO = new CategoryDAO();

    public static List<Category> getAllCategories() {

        return categoryDAO.findAllCategories();
    }

    public static Category addCategory(Category category) {
        categoryDAO.saveCategory(category);
        return new Category(categoryDAO.findCategoryByName(category).getId(),categoryDAO.findCategoryByName(category).getCategory());
    }

    public static String removeCategory(Category category){
        categoryDAO.deleteCategory(SQLQuery.deleteFromCommonTableCategory,category.getId());
        return categoryDAO.deleteCategory(SQLQuery.deleteCategory, category.getId());
    }

    public static Category editCategory (Category category){
        return categoryDAO.rearrangeCategory(category);
    }
}