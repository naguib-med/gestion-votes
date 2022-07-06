package fr.univlyon1.m1if.m1if03.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import fr.univlyon1.m1if.m1if03.classes.User;
import fr.univlyon1.m1if.m1if03.classes.UserDTO;
import fr.univlyon1.m1if.m1if03.utils.ElectionM1if03JwtHelper;

import javax.json.JsonObject;
import javax.json.JsonValue;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@WebServlet(name = "Users" , urlPatterns = {"/users","/users/*"})
public class Users extends HttpServlet {
    Map<String, User> users;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.users = (Map<String, User>) config.getServletContext().getAttribute("users");
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String[] path;
        path = request.getRequestURI().split("/");
        int n = path.length;
        if (path.length != 0) {
            if (path[n-1].equals("users")) {
                List<String> userURI = new ArrayList<>();
                for (String key : users.keySet()) {
                    userURI.add(request.getRequestURL() + "/" + key);
                }
                printJsonResponse(userURI, response);
                response.setStatus(HttpServletResponse.SC_OK);
            }

            if (path[n - 2].equals("users")) {
                String userLogin = path[n - 1];
                User user = getUserByLogin(userLogin);
                if (user != null) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    printJsonResponse(user, response);
                } else if (!user.isAdmin()){
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                }else if (request.getHeader("Authorization") == null){
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                }
                else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                }
            }

            if (path[n-3].equals("users")) {
                String userLogin = path[n-2];
                if(path[n-1].equals("ballot")){
                    User user = getUserByLogin(userLogin);
                    if (user != null) {
                        response.addHeader("Location",getBaseUrl(String.
                                valueOf(request.getRequestURL())) + "/ballot/byUser/" + userLogin);
                        response.setStatus(HttpServletResponse.SC_SEE_OTHER);
                    } else {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    }
                }
            }


//        processRequest(req, resp);
        }
    }

    private User getUserByBallot(String nameBallot) {
        return null;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path[] = request.getRequestURI().split("/");
        int n = path.length;

        if (path.length != 0) {
            //  /users/login
            if (path[n - 2].equals("users")) {
                if (path[n - 1].equals("login")) {
                    ObjectMapper jsonMapper = new ObjectMapper();
////                    User user = jsonMapper.readValue(request.getReader(), User.class);
////                    UserDTO userDTO = new Gson().fromJson(request.getReader(), UserDTO.class);
//
                    UserDTO userDTO = jsonMapper.readValue(request.getReader(), UserDTO.class);
//                    System.out.println(userDTO.getLogin());
                    User user = new User(userDTO.getLogin());
                    user.setNom(userDTO.getNom());
                    user.setAdmin(userDTO.isAdmin());
                    if(!users.containsKey(user.getLogin())){
                        users.put(userDTO.getLogin(), user);
                    }
                    String token = ElectionM1if03JwtHelper.generateToken(user.getLogin(), user.isAdmin(), request);
                    response.setHeader("Authorization", "Bearer " + token);
                    response.addHeader("Location", getBaseUrl(String.valueOf(request.getRequestURL())) + "/users/" + userDTO.getLogin());

                    Cookie tokenCookies = new Cookie("token", token);
                    response.addCookie(tokenCookies);
                    tokenCookies.setMaxAge(40*40);

                    response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                }
                else if(path[n-1].equals("logout")) {
                    response.sendRedirect("/Deco");
                }
                else {
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                }
            }

        }
        //processRequest(req, resp);
    }


    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        String path [] = request.getRequestURI().split("/");
        int n = path.length;
        if (path.length != 0) {
            // /users/{userId}/nom
            if (path[n-3].equals("users")) {
                String userLogin = path[n-2];
                User user = getUserByLogin(userLogin);
                if(path[n-1].equals("nom")){
                    if(user != null){
                        ObjectMapper jsonMapper = new ObjectMapper();
                        UserDTO userDTO = jsonMapper.readValue(request.getReader(), UserDTO.class);
                        user.setNom(userDTO.getNom());
                        users.put(user.getLogin(), user);
                        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                    } else {
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    }
                }
            }
        }

    }



    protected void processRequest(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getRequestURI().replace(req.getContextPath() + "/users/", "");
        req.setAttribute("action", action); // Utilisé dans electionHome.jsp

        switch(action) {
            case "login":
                this.getServletContext().getNamedDispatcher("Home").forward(req, resp);
                break;
            case "logout":
                this.getServletContext().getNamedDispatcher("Deco").forward(req, resp);
                break;
            default:
                resp.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }

    public void printJsonResponse(Object objet, HttpServletResponse response) throws IOException {
        Gson gson = new Gson();

        String jsonResponse =  gson.toJson(objet);
        response.setContentType("application/json");
        PrintWriter printWriter = response.getWriter();
        printWriter.write(jsonResponse);
        printWriter.close();
    }

    public static String getBaseUrl(String urlString) {
        if(urlString == null) { return null;}
        try {
            URL url = URI.create(urlString).toURL();
            return url.getProtocol() + "://" + url.getAuthority();
        } catch (Exception e) {
            return null;
        }
    }



    public User getUserByLogin(String login) {
        for (Map.Entry<String, User> entry : users.entrySet())
            if (entry.getKey().equals(login)) {
                return entry.getValue();
            }
        return null;
    }
    
    


}
