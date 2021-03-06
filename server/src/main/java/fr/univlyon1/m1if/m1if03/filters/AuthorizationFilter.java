package fr.univlyon1.m1if.m1if03.filters;

import fr.univlyon1.m1if.m1if03.classes.User;
import fr.univlyon1.m1if.m1if03.utils.ElectionM1if03JwtHelper;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "AuthorizationFilter", urlPatterns = {"/election/listBallots"})
public class AuthorizationFilter extends HttpFilter {
    @Override
    protected void doFilter(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws IOException, ServletException {
//        if(((User) req.getSession().getAttribute("user")).isAdmin()) {
//            super.doFilter(req, res, chain);
//        } else {
//            res.sendError(HttpServletResponse.SC_FORBIDDEN, "Vous devez être administrateur pour accéder à cette page.");
//        }

        String token = req.getHeader("Authorization");
        String[] tabToken = token.split(" ");
        boolean isAdmin = ElectionM1if03JwtHelper.verifyAdmin(tabToken[1]);
        if(isAdmin){
            chain.doFilter(req, res);
        } else {
            res.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }
}