package fr.univlyon1.m1if.m1if03.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import fr.univlyon1.m1if.m1if03.classes.*;


import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet(name="Ballots", urlPatterns = {"/election/ballots","/election/ballots/*"})
public class ControllerBallots extends HttpServlet {
    Map<String, Ballot> ballots;
    List<Bulletin> bulletins;
    Map<String, Candidat> candidats;



    @Override
    @SuppressWarnings("unchecked")
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        candidats = (Map<String, Candidat>) config.getServletContext().getAttribute("candidats");
        System.out.println("Candidats : " + candidats.size());

        bulletins = (List<Bulletin>) config.getServletContext().getAttribute("bulletins");
        System.out.println("Bulletins : " + bulletins.size());

        ballots = (Map<String, Ballot>) config.getServletContext().getAttribute("ballots");
        System.out.println("Ballots : " + ballots.size());

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        String candidat = request.getParameter("nomCandidat");
        if (candidat == null || candidat.equals("")) {
            response.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, "Cette application ne prend pas encore en charge le vote blanc.");
            return;
        }

        UserDTO userDTO = new UserDTO();
        User user = new User(userDTO.getLogin());
        Bulletin bulletin = new Bulletin(candidats.get(candidat));
        bulletins.add(bulletin);
        Ballot ballot = new Ballot(bulletin);
        ballots.put(user.getLogin(), ballot);

//        request.getRequestDispatcher("/WEB-INF/components/electionHome.jsp").forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String path[] = request.getRequestURI().split("/");
        int n = path.length;

        if (path.length != 0) {

            if (path[n - 1].equals("ballots")) {
                List<String> ballotsURI = new ArrayList<>();
                for (String key : ballots.keySet()){
                    Ballot b = ballots.get(key);
                    ballotsURI.add(request.getRequestURL() + "/" +b.getBallotID());
                }
//                for (String key : ballots.keySet()) {
//                    ballotsURI.add(request.getRequestURL() + "/" + key);
//
//                }
                response.setStatus(HttpServletResponse.SC_OK);
                request.setAttribute("ballots", ballotsURI);
                printJsonResponse(ballotsURI, response);

            }
            if (path[n - 2].equals("ballots")) {
                int ballotId = Integer.parseInt(path[n - 1]);
                Ballot ballot = getBallotByIdBallot(ballotId);
                if (ballot != null) {
                    response.setStatus(HttpServletResponse.SC_OK);
                    printJsonResponse(ballot, response);
                }
                else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                }
            }

        }
//        req.getRequestDispatcher("/WEB-INF/components/listBallots.jsp").forward(req, resp);

//        response.setContentType("text/html;charset=UTF-8");
//        PrintWriter out = response.getWriter();
//
//        for (String key : ballots.keySet()){
//            Ballot b = ballots.get(key);
//            out.println("http://localhost:8080/election/ballots/"+b.getBallotID());
//            out.println("<br><br>");
//        }
//        out.close();



    }

    private Ballot getBallotByIdBallot(int ballotId) {
        for (Map.Entry<String, Ballot> entry : ballots.entrySet())
            if (entry.getValue().getBallotID() == ballotId) {
                return entry.getValue();
            }
        return null;
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String path [] = request.getRequestURI().split("/");
        int n = path.length;
        if (path.length != 0) {

            if(path[n-2].equals("ballots")){
                int ballotID = Integer.parseInt(path[n-1]);

                if (ballotID < 0){
                    response.sendError(HttpServletResponse.SC_NOT_FOUND);
                }else{
                    for (String key : ballots.keySet()){
                        if (ballots.get(key).getBallotID() == ballotID){
                            Ballot b = ballots.get(key);
                            ballots.remove(b);
                        }
                    }
                    response.setStatus(HttpServletResponse.SC_NO_CONTENT);
                }
            }
        }


        // doGet(request, response);

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