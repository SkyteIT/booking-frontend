import { Box } from "@mui/material";
import VendorSidebar from "../../components/navbars/VendorSidebar";
import MainNavbar from "../../components/navbars/MainNavbar";
import MainFooter from "../../components/footer/MainFooter";

interface VendorLayoutProps {
    children: React.ReactNode;
}

const VendorLayout = ({ children }: VendorLayoutProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <MainNavbar />

            <Box sx={{ display: "flex", flexGrow: 1 }}>
                <VendorSidebar />

                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
                    <Box component="main" sx={{ flexGrow: 1 }}>
                        {children}
                    </Box>
                    <MainFooter />
                </Box>
            </Box>
        </Box>
    );
};

export default VendorLayout;
