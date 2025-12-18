package com.jhipster.demo.store;

import com.jhipster.demo.store.config.ApplicationProperties;
import com.jhipster.demo.store.config.CRLFLogConverter;
import jakarta.annotation.PostConstruct;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.Collection;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.env.Environment;
import tech.jhipster.config.DefaultProfileUtil;
import tech.jhipster.config.JHipsterConstants;

@SpringBootApplication
@EnableConfigurationProperties({ LiquibaseProperties.class, ApplicationProperties.class })
public class StoreApp {

    private static final Logger LOG = LoggerFactory.getLogger(StoreApp.class);

    private final Environment env;

    public StoreApp(Environment env) {
        this.env = env;
    }

    /**
     * Initializes store.
     * <p>
     * Spring profiles can be configured with a program argument --spring.profiles.active=your-active-profile
     * <p>
     * You can find more information on how profiles work with JHipster on <a href="https://www.jhipster.tech/profiles/">https://www.jhipster.tech/profiles/</a>.
     */
    @PostConstruct
    public void initApplication() {
        Collection<String> activeProfiles = Arrays.asList(env.getActiveProfiles());
        if (
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) &&
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_PRODUCTION)
        ) {
            LOG.error(
                "You have misconfigured your application! It should not run " + "with both the 'dev' and 'prod' profiles at the same time."
            );
        }
        if (
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT) &&
            activeProfiles.contains(JHipsterConstants.SPRING_PROFILE_CLOUD)
        ) {
            LOG.error(
                "You have misconfigured your application! It should not " + "run with both the 'dev' and 'cloud' profiles at the same time."
            );
        }
    }

    /**
     * Main method, used to run the application.
     *
     * @param args the command line arguments.
     */
    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(StoreApp.class);
        DefaultProfileUtil.addDefaultProfile(app);
        Environment env = app.run(args).getEnvironment();
        logApplicationStartup(env);
    }

    private static void logApplicationStartup(Environment env) {
        String protocol = Optional.ofNullable(env.getProperty("server.ssl.key-store")).map(key -> "https").orElse("http");
        String applicationName = env.getProperty("spring.application.name");
        String serverPort = env.getProperty("server.port");
        String contextPath = Optional.ofNullable(env.getProperty("server.servlet.context-path"))
            .filter(StringUtils::isNotBlank)
            .orElse("/");
        String hostAddress = "localhost";
        try {
            hostAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            LOG.warn("The host name could not be determined, using `localhost` as fallback");
        }
        
        // Log de inicio enriquecido con información del sistema
        LOG.info(
            CRLFLogConverter.CRLF_SAFE_MARKER,
            """

            ----------------------------------------------------------
            \tApplication '{}' is running! Access URLs:
            \tLocal: \t\t{}://localhost:{}{}
            \tExternal: \t{}://{}:{}{}
            \tProfile(s): \t{}
            ----------------------------------------------------------""",
            applicationName,
            protocol,
            serverPort,
            contextPath,
            protocol,
            hostAddress,
            serverPort,
            contextPath,
            env.getActiveProfiles().length == 0 ? env.getDefaultProfiles() : env.getActiveProfiles()
        );
        
        // Logs enriquecidos de configuración del sistema
        Runtime runtime = Runtime.getRuntime();
        long maxMemoryMB = runtime.maxMemory() / 1024 / 1024;
        long totalMemoryMB = runtime.totalMemory() / 1024 / 1024;
        int availableProcessors = runtime.availableProcessors();
        
        LOG.info("System Configuration - Java Version: {}, Max Memory: {}MB, Total Memory: {}MB, Processors: {}",
            System.getProperty("java.version"),
            maxMemoryMB,
            totalMemoryMB,
            availableProcessors
        );
        
        // Log de configuración de base de datos
        String r2dbcUrl = env.getProperty("spring.r2dbc.url");
        String datasourceUrl = env.getProperty("spring.datasource.url");
        if (r2dbcUrl != null) {
            LOG.info("Database Configuration - R2DBC URL: {} (Reactive Driver)", maskPassword(r2dbcUrl));
        }
        if (datasourceUrl != null) {
            LOG.info("Database Configuration - Datasource URL: {}", maskPassword(datasourceUrl));
        }
        
        // Log de configuración de Logstash si está habilitado
        String logstashEnabled = env.getProperty("logging.logstash.enabled");
        if ("true".equals(logstashEnabled)) {
            String logstashHost = env.getProperty("logging.logstash.host");
            String logstashPort = env.getProperty("logging.logstash.port");
            LOG.info("Observability - Logstash logging enabled at {}:{}", logstashHost, logstashPort);
        }
        
        LOG.info("Application startup completed successfully - Ready to accept requests");
    }
    
    private static String maskPassword(String url) {
        if (url == null) return "";
        return url.replaceAll(":[^:@]+@", ":****@");
    }
}
