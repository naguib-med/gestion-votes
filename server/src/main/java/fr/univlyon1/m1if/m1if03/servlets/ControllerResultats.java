package fr.univlyon1.m1if.m1if03.servlets;

import com.google.gson.Gson;
import fr.univlyon1.m1if.m1if03.classes.Bulletin;
import fr.univlyon1.m1if.m1if03.classes.Candidat;


import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet(name = "ControllerResultats", urlPatterns = {"/election/resultats"})
public class ControllerResultats extends HttpServlet {
    Map<String, Candidat> candidats;
    List<Bulletin> bulletins;

    @SuppressWarnings("unchecked")
    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        bulletins = (List<Bulletin>) config.getServletContext().getAttribute("bulletins");
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path[] = request.getRequestURI().split("/");
        int n = path.length;

        if (n != 0){
            if (path[n-1].equals("resultats")){
                candidats = (Map<String, Candidat>) request.getServletContext().getAttribute("candidats");
                Map<String, Integer> votes = new HashMap<>();

                for (String nomCandidat : candidats.keySet()) {
                    votes.put(nomCandidat, 0);
                }

                for (Bulletin bulletin : bulletins) {
                    int score = votes.get(bulletin.getCandidat().getNom());
                    votes.put(bulletin.getCandidat().getNom(), ++score);
                }
                response.setStatus(HttpServletResponse.SC_OK);
                request.setAttribute("votes", votes);
                printJsonResponse(votes,response);
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    public void printJsonResponse(Object objet, HttpServletResponse response) throws IOException {
        Gson gson = new Gson();

        String jsonResponse =  gson.toJson(objet);
        response.setContentType("application/json");
        PrintWriter printWriter = response.getWriter();
        printWriter.write(jsonResponse);
        printWriter.close();
    }
}
