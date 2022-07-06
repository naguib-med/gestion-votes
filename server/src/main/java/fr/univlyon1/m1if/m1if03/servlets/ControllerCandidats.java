package fr.univlyon1.m1if.m1if03.servlets;

import fr.univlyon1.m1if.m1if03.classes.Candidat;
import com.google.gson.Gson;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet(name="Candidats", urlPatterns = {"/election/candidats","/election/candidats/*"})
public class ControllerCandidats extends HttpServlet {
    Map<String, Candidat> candidats;

    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        this.candidats = (Map<String, Candidat>) config.getServletContext().getAttribute("candidats");
    }

    @Override
    @SuppressWarnings("unchecked")
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path[] = request.getRequestURI().split("/");
        int n = path.length;

        if (path.length != 0){

            if (path[n-1].equals("candidats")) {
                List<String> candidatsURI = new ArrayList<>();
                for (String key : candidats.keySet()) {
                    candidatsURI.add(request.getRequestURL() + "/" + key);

                }
                response.setStatus(HttpServletResponse.SC_OK);
//                request.setAttribute("candidats", candidatsURI);
                printJsonResponse(candidatsURI,response);

            }

            if (path[n-2].equals("candidats") && path[n-1].equals("noms")){
                List<String> listNomsCandidats = new ArrayList<>();
                for (String key : candidats.keySet()) {
                    listNomsCandidats.add(""+key);
                }
                response.setStatus(HttpServletResponse.SC_OK);
                printJsonResponse(listNomsCandidats, response);
            }
            // /election/candidats/{candidatID}
            if (path[n-2].equals("candidats")) {
                String nomCandidat = path[n-1];
                Candidat candidat = getCandidatByName(nomCandidat);
                if (candidat != null) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    printJsonResponse(candidat,response);
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                }
            }



        }

//            candidats = (Map<String, Candidat>) request.getServletContext().getAttribute("candidats");
//            Map<String, Integer> noms = new HashMap<>();
//            for (String nomCandidat : candidats.keySet()) {
//                noms.put(nomCandidat, 0);
//                System.out.println(nomCandidat);
//            }
//            request.setAttribute("noms", noms);
//            request.getRequestDispatcher("/WEB-INF/components/listCandidats.jsp").forward(request, response);
    }


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }



    public Candidat getCandidatByName(String nomCandidat) {
        for (Map.Entry<String, Candidat> entry : candidats.entrySet())
            if (entry.getKey().equals(nomCandidat)) {
                System.out.println("entré");
                return entry.getValue();
            }
        return null;
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