package fr.univlyon1.m1if.m1if03.filters;

import fr.univlyon1.m1if.m1if03.classes.Candidat;
import fr.univlyon1.m1if.m1if03.classes.User;
import fr.univlyon1.m1if.m1if03.utils.ElectionM1if03JwtHelper;

import javax.servlet.*;
import javax.servlet.annotation.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.Map;

@WebFilter(filterName = "AuthenticationFilter", urlPatterns = "/*")
public class AuthenticationFilter extends HttpFilter {
    private final String[] authorizedURIs = {"/index.html", "/static", "/election/resultats", "/election/candidats", "/election/candidats/noms","/users/login","/users/logout","/users","/users/*"}; // Manque "/", traité plus bas...


    Map<String, User> users;

    @SuppressWarnings("unchecked")
    public void init(FilterConfig config) throws ServletException {
        super.init(config);
        this.users = (Map<String, User>) config.getServletContext().getAttribute("users");
    }

    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
        String currentUri = req.getRequestURI().replace(req.getContextPath(), "");

        // Traitement de l'URL racine
        if(currentUri.equals("/")) {
            res.sendRedirect("index.html");
            return;
        }

        // Traitement des autres URLs autorisées sans authentification
        for(String authorizedUri: authorizedURIs) {
            if(currentUri.startsWith(authorizedUri)) {
                super.doFilter(req, res, chain);
                return;
            }
        }

        // Test des URLs qui nécessitent une autorisation

        String token = req.getHeader("Authorization");
        String login  = ElectionM1if03JwtHelper.verifyToken(token.replace("Bearer ", ""),req);

        if(login != null){
            req.setAttribute("token", token);
            chain.doFilter(req, res);
        } else {
            res.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            res.sendRedirect("./");
        }

//        HttpSession session = req.getSession(false); // On récupère la session sans la créer
//        if(session != null && session.getAttribute("user") != null) {
//            super.doFilter(req, res, chain);
//        } else {
//            String login = req.getParameter("login");
//            if(req.getMethod().equals("POST") && login != null && !login.equals("")) {
//                session = req.getSession(true);
//                session.setAttribute("user", new User(login,
//                        req.getParameter("nom") != null ? req.getParameter("nom") : "",
//                        req.getParameter("admin") != null && req.getParameter("admin").equals("on")));
//                super.doFilter(req, res, chain);
//            } else
//                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Vous devez être connecté pour accéder à cette page.");
//        }






    }

}