<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: naguib
  Date: 04/12/2021
  Time: 01:16
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<jsp:include page="title.jsp?title= Noms des candidats"/>
<main id="contenu" class="wrapper">
    <article class="contenu">
        <h2>Voici les noms des candidats</h2>

        <ul>
            <c:forEach items="${requestScope.noms}" var="nomCandidat">
                <li><c:out value="${nomCandidat.key}"/></li>
            </c:forEach>
        </ul>
    </article>
</main>
</body>
</html>
