package fr.univlyon1.m1if.m1if03.classes;

public class Ballot {
    Bulletin bulletin;
    private int ballotID = 0;

    public Ballot(Bulletin bulletin) {
        this.bulletin = bulletin;

    }

    public Bulletin getBulletin() {
        return bulletin;
    }

    public void setBulletin(Bulletin bulletin) {
        this.bulletin = bulletin;
    }

    public int getBallotID() {
        return ballotID;
    }

    public void setBallotID(int ballotID){
        this.ballotID = ballotID;
    }

}
