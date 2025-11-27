package web.backend.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import web.backend.dto.UserCredentialsDTO;
import web.backend.model.UserCredentials;
import web.backend.repository.UserCredentialsRepository;
import web.backend.util.PasswordHash;
import web.backend.util.Result;

@ApplicationScoped
public class UserService {
    @Inject
    private UserCredentialsRepository repository;

    @Inject
    private PasswordHash passwordHash;

    public Result<UserCredentials> register(UserCredentialsDTO newUser) {
        boolean usernameExists = repository.isUsernameTaken(newUser.getUsername());

        if(usernameExists) {
            return new Result<UserCredentials>(false, "Имя пользователя уже занято", null);
        }

        String hashedPassword = passwordHash.hashPassword(newUser.getPassword());

        UserCredentials userCredentials = new UserCredentials();
        userCredentials.setUsername(newUser.getUsername());
        userCredentials.setPassword(hashedPassword);

        repository.addUserCredentials(userCredentials);

        return new Result<UserCredentials>(true, "",  userCredentials);
    }

    public Result<UserCredentials> login(UserCredentialsDTO user) {
        UserCredentials userCredentials = repository.getUserByUsername(user.getUsername());

        if(userCredentials == null) {
            return new Result<UserCredentials>(false, "Пароль или имя пользователя неверно", null);
        }

        boolean isPasswordMatch = passwordHash.verifyPassword(user.getPassword(), userCredentials.getPassword());

        if(!isPasswordMatch) {
            return new Result<UserCredentials>(false, "Пароль или имя пользователя неверно", null);
        }

        return new Result<UserCredentials>(true, "", userCredentials);
    }

    public UserCredentials getUserByUsername(String username) {
        return repository.getUserByUsername(username);
    }
}
