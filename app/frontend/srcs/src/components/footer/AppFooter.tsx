import { useContext } from "react";
import { UserContext } from "../../contexts/user/UserContext";

const AppFooter = () => {
    const user = useContext(UserContext);

    return (
        <footer id="app-footer">
            {user.status !== "" && (
                <p>
                    status :{" "}
                    {user.status === "ingame" ? "in game" : user.status}
                </p>
            )}
        </footer>
    );
};
export default AppFooter;
