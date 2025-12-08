import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Casino from "./pages/Casino";
import LiveCasino from "./pages/LiveCasino";
import Sports from "./pages/Sports";
import Profile from "./pages/Profile/Profile";
import PersonalProfile from "./pages/Profile/PersonalProfile";
import ProfileHistory from "./pages/Profile/ProfileHistory";
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout/Layout";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/casino" element={<Casino />} />
                <Route path="/live-casino" element={<LiveCasino />} />
                <Route path="/sports" element={<Sports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/personal-profile" element={<PersonalProfile />} />
                <Route path="/profile/history" element={<ProfileHistory />} />
                <Route path="*" element={<NoPage />} />
            </Route>
        </Routes>
    );
}