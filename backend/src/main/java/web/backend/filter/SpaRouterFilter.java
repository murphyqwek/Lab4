package web.backend.filter;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;

// Настраиваем фильтр для перехвата всех запросов (*)
@WebFilter("/*")
public class SpaRouterFilter implements Filter {
    private static final String INDEX_PAGE = "/index.html";

    private static final String[] IGNORED_PREFIXES = {
            "/api/",
            "/assets/",
            "/vendor/",
            "/favicon.ico"
    };

    private static final String[] STATIC_FILE_EXTENSIONS = {
            ".css", ".js", ".map", ".jpg", ".jpeg", ".png", ".gif", ".svg", ".eot", ".ttf", ".woff", ".woff2", ".ico"
    };

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String path = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());

        for (String prefix : IGNORED_PREFIXES) {
            if (path.startsWith(prefix)) {
                chain.doFilter(request, response);
                return;
            }
        }

        for (String extension : STATIC_FILE_EXTENSIONS) {
            if (path.toLowerCase().endsWith(extension)) {
                chain.doFilter(request, response);
                return;
            }
        }

        if (path.equals(INDEX_PAGE) || path.equals("/")) {
            chain.doFilter(request, response);
            return;
        }

        RequestDispatcher dispatcher = request.getRequestDispatcher(INDEX_PAGE);
        dispatcher.forward(request, response);
    }
}
