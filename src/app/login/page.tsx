'use client'


export default function Login() {
    //const test_email = 'sb-89a43m40169106@business.example.com';
    //const test_password = '123';
    //const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');



    /*
        function checkCredentials() {
            let login = false;
            if (test_email && test_password) {
                login = true;
            } else {
                console.log('Wrong credentials');
            }
        }
            */

    return (
        <>
            <div className="container vscentered p-6">
                <div className="field">
                    <p className="control has-icons-left has-icons-right">
                        <input className="input" type="email" placeholder="Email" />
                        <span className="icon is-small is-left">
                            <i className="fas fa-envelope"></i>
                        </span>
                        <span className="icon is-small is-right">
                            <i className="fas fa-check"></i>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control has-icons-left">
                        <input className="input" type="password" placeholder="Password" />
                        <span className="icon is-small is-left">
                            <i className="fas fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div className="field">
                    <p className="control">
                        <button className="button is-success">
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </>
    )
}