import Model.Category;
import database.DBConnection;
import database.SQLQuery;

import java.sql.SQLException;
import java.util.*;

class CategoryDAO {

    private Category category = new Category();
    private DBConnection dbConnection = new DBConnection();

    List<Category> findAllCategories() {

        List<Category> listOfCategory = new ArrayList<>();

        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.getAllCategory);
        dbConnection.getResultSet();

        try {
            while (dbConnection.resultSet.next()) {
                Category category = new Category();
                category.setId(dbConnection.resultSet.getInt("categoryID"));
                category.setCategory(dbConnection.resultSet.getString("categoryName"));
                listOfCategory.add(category);
            }
            System.out.println(listOfCategory.toString());

            dbConnection.closeConnection();
            return listOfCategory;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    synchronized void saveCategory(Category category) {

        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.insertNewCategory);

        category.setCategory(category.getCategory().trim());

        try {
            dbConnection.preparedStatement.setString(1, category.getCategory());
            dbConnection.preparedStatement.execute();
            dbConnection.closeConnection();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    Category findCategoryByName(Category addedCategory) {

        List<Category> listOfCategory = findAllCategories();

        for (Category category : listOfCategory)
            if (addedCategory.getCategory().equals(category.getCategory())) {
                return category;
            }
        return null;
    }

    String deleteCategory(String sqlRequest, int categoryId) {
        dbConnection.setConnection();
        dbConnection.setPreparedStatement(sqlRequest);

        try {
            dbConnection.preparedStatement.setInt(1, categoryId);
            dbConnection.preparedStatement.execute();
            dbConnection.closeConnection();
            return "ok";

        } catch (SQLException e) {
            e.printStackTrace();
        } return null;
    }

    Category rearrangeCategory(Category category) {
        dbConnection.setConnection();
        dbConnection.setPreparedStatement(SQLQuery.editCategory);

        try {
            dbConnection.preparedStatement.setString(1, category.getCategory());
            dbConnection.preparedStatement.setInt(2, category.getId());
            dbConnection.preparedStatement.execute();
            dbConnection.closeConnection();
            return category;

        } catch (SQLException e) {
            e.printStackTrace();
        } return null;
    }
}
