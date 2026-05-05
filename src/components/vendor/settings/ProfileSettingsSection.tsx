import type { ChangeEvent } from "react";
import { Avatar, Box, Button, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import type { ProfileForm } from "./types";

type ProfileSettingsSectionProps = {
	form: ProfileForm;
	onFieldChange: (field: keyof ProfileForm, value: string) => void;
	onUploadPhoto?: (file: File) => void | Promise<void>;
};

export default function ProfileSettingsSection({ form, onFieldChange, onUploadPhoto }: ProfileSettingsSectionProps) {
	const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && onUploadPhoto) {
			onUploadPhoto(file);
		}
		event.target.value = "";
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
			
			{/*Avatar Section */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<Avatar
					src={form.profileImageUrl || undefined}
					sx={(theme) => ({
						width: 56,
						height: 56,
						bgcolor: alpha(theme.palette.primary.main, 0.08),
						color: "primary.main",
						border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
						objectFit: "cover",
					})}
				>
					<PersonOutlineIcon />
				</Avatar>

				<Stack spacing={0.5}>
					<Button
						size="small"
						variant="text"
						startIcon={<CloudUploadOutlinedIcon />}
						component="label"
						sx={{
							textTransform: "none",
							fontWeight: 500,
						}}
					>
						Upload photo
						<input hidden accept="image/*" type="file" onChange={handlePhotoChange} />
					</Button>

					<Typography variant="caption" color="text.secondary">
						JPG, PNG or GIF (max 5MB)
					</Typography>
				</Stack>
			</Box>

			{/* Form Fields */}
			<Box
				sx={{
					display: "grid",
					gap: 2,
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
				}}
			>
				<TextField
					label="First name"
					value={form.firstName}
					onChange={(e) => onFieldChange("firstName", e.target.value)}
					fullWidth
					size="small"
					margin="dense"
					InputLabelProps={{
						sx: {
							color: "text.secondary",
							"&.Mui-focused": { color: "text.primary" },
						},
					}}
					sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
				/>

				<TextField
					label="Last name"
					value={form.lastName}
					onChange={(e) => onFieldChange("lastName", e.target.value)}
					fullWidth
					size="small"
					margin="dense"
					InputLabelProps={{
						sx: {
							color: "text.secondary",
							"&.Mui-focused": { color: "text.primary" },
						},
					}}
					sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
				/>
			</Box>

			<TextField
				label="Email"
				value={form.email}
				onChange={(e) => onFieldChange("email", e.target.value)}
				fullWidth
				size="small"
				margin="dense"
				InputProps={{ readOnly: true }}
				InputLabelProps={{
					sx: {
						color: "text.secondary",
						"&.Mui-focused": { color: "text.primary" },
					},
				}}
				sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
			/>

			<TextField
				label="Phone"
				value={form.phone}
				onChange={(e) => onFieldChange("phone", e.target.value)}
				fullWidth
				size="small"
				margin="dense"
				InputLabelProps={{
					sx: {
						color: "text.secondary",
						"&.Mui-focused": { color: "text.primary" },
					},
				}}
				sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
			/>

			<TextField
				label="Business name"
				value={form.businessName}
				onChange={(e) => onFieldChange("businessName", e.target.value)}
				fullWidth
				size="small"
				margin="dense"
				InputLabelProps={{
					sx: {
						color: "text.secondary",
						"&.Mui-focused": { color: "text.primary" },
					},
				}}
				sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
			/>

			<TextField
				label="Bio"
				value={form.bio}
				onChange={(e) => onFieldChange("bio", e.target.value)}
				fullWidth
				multiline
				minRows={3}
                size="small"
				margin="dense"
				InputLabelProps={{
					sx: {
						color: "text.secondary",
						"&.Mui-focused": { color: "text.primary" },
					},
				}}
				sx={{ "& .MuiInputBase-input": { color: "text.primary" } }}
                placeholder="Tell us about your business, services, and anything else you'd like to share."
			/>
		</Box>
	);
}