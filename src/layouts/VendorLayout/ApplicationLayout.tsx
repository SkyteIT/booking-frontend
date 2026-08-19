import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import MainNavbar from "../../components/navbars/MainNavbar";
import MainFooter from "../../components/footer/MainFooter";
import StepperBar from "../../components/navbars/StepperBar";

interface ApplicationLayoutProps {
  children: ReactNode;
  activeStep: number;
}

const ApplicationLayout = ({ children, activeStep }: ApplicationLayoutProps) => {
  return (
    <Box sx={{ backgroundColor: "#f3f6f9", minHeight: "100vh" }}>
      <MainNavbar />

      <Container maxWidth="md" sx={{ py: 5 }}>
        {/* First white box */}
        <StepperBar activeStep={activeStep} />

        {/* Second white box */}
        <Box sx={{ mt: 3 }}>
          {children}
        </Box>
      </Container>

      <MainFooter />
    </Box>
  );
};

export default ApplicationLayout;