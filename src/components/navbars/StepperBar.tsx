// src/components/navbars/StepperBar.tsx

  
  import BusinessIcon from "@mui/icons-material/Business";
  import CategoryIcon from "@mui/icons-material/Category";
  import CheckIcon from "@mui/icons-material/Check";
  import DescriptionIcon from "@mui/icons-material/Description";
  import PersonIcon from "@mui/icons-material/Person";
import {
    Stepper,
    Step,
    StepLabel,
    Box,
    StepConnector,
    stepConnectorClasses,
  } from "@mui/material";
  import { styled } from "@mui/material/styles";
  
  interface StepperBarProps {
    activeStep: number;
  }
  
  const steps = [
    { label: "Business Info", icon: BusinessIcon },
    { label: "Contact", icon: PersonIcon },
    { label: "Categories", icon: CategoryIcon },
    { label: "Documents", icon: DescriptionIcon },
    { label: "Review", icon: CheckIcon },
  ];
  
  /* ----- Custom Connector ----- */
  const CustomConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: "#d1d5db",
      borderRadius: 1,
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
      backgroundColor: "#2f6db2",
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
      backgroundColor: "#2f6db2",
    },
  }));
  
  const StepperBar = ({ activeStep }: StepperBarProps) => {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px 32px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          mb: 3,
        }}
      >
        <Box sx={{ fontWeight: 600, mb: 3 }}>
          Vendor Application
        </Box>
  
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<CustomConnector />}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
  
            return (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
  
                    return (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isCompleted
                            ? "#2f6db2"
                            : isActive
                            ? "#dbeafe"
                            : "#e5e7eb",
                          color: isCompleted
                            ? "#ffffff"
                            : isActive
                            ? "#2f6db2"
                            : "#9ca3af",
                        }}
                      >
                        {isCompleted ? <CheckIcon /> : <Icon />}
                      </Box>
                    );
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  };
  
  export default StepperBar;