import { useState } from "react";

const PasswordChange = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConf, setNewPasswordConf] = useState("");

  async function handlePasswordChange() {
    
  }
  return (
    <div>
      <form onSubmit={handlePasswordChange} className="form">
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
            New Password:
            <input type="password" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
        </label>
        <label>
           Confirm New Password:
            <input type="password" value={newPasswordConf} onChange={(e)=> setNewPasswordConf(e.target.value)}/>
        </label>
        <button>Change Password</button>
      </form>
    </div>
  );
};
export default PasswordChange;
