import { useContext } from "react";
import { UserContext } from "../../contexts/UserProvider";

const AppFooter = () => {
    const user = useContext(UserContext);

    return (
        <footer id="app-footer">
            {user.status !== "" && <p>status : {user.status}</p>}
        </footer>
    );
};
export default AppFooter;
