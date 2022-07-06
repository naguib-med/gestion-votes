package fr.univlyon1.m1if.m1if03.classes;

public class UserDTO {
    private String nom;
    private String login;
    private boolean admin;

    public UserDTO(){}
    public UserDTO(User user) {
        this.nom = user.getNom();
        this.login = user.getLogin();
        this.admin = user.isAdmin();
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isAdmin() {
        return admin;
    }
}
