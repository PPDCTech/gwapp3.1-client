import { useState } from "react";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	Divider,
	Typography,
} from "@mui/material";
import { uploadFileAPI } from "../../services/api/uploads.api";
import { capitalizeFirstLetter } from "../../services/helpers";
import {
	updateProfilePic,
	updateSignaturePic,
} from "../../services/api/users.api";
import { toast } from "react-toastify";
import { Cancel } from "@mui/icons-material";

export const AccountProfile = ({ user, setUser }) => {
	const [image, setImage] = useState(null);
	const [signature, setSignature] = useState(null);
	const [saving, setSaving] = useState(false);
	const [savingSig, setSavingSig] = useState(false);

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const handleSignatureChange = (e) => {
		setSignature(e.target.files[0]);
	};

	const handleImageUpload = async () => {
		try {
			setSaving(true);
			const formData = new FormData();
			formData.append("files", image);
			formData.append("destination", "profile-photos");

			const response = await uploadFileAPI(formData);

			const { imageUrls } = await response.data;
			const updatedPhotoUrl = imageUrls[0].imageUrl;

			const update_response = await updateProfilePic(user._id, updatedPhotoUrl);

			if (update_response.status === 200) {
				const updatedUser = { ...user, photoUrl: updatedPhotoUrl };
				setUser(updatedUser);

				toast.success("You've changed your profile photo!");
				setImage(null);
			}
		} catch (error) {
			toast.error("Error uploading image");
			console.error("Error uploading image:", error);
		} finally {
			setSaving(false);
		}
	};

	const handleSignatureUpload = async () => {
		try {
			setSavingSig(true);
			const formData = new FormData();
			formData.append("files", signature);
			formData.append("destination", "signature-photos");

			const response = await uploadFileAPI(formData);

			const { imageUrls } = await response.data;
			const updatedSignatureUrl = imageUrls[0].imageUrl;

			const update_response = await updateSignaturePic(
				user._id,
				updatedSignatureUrl,
			);

			if (update_response.status === 200) {
				const updatedUser = { ...user, signatureUrl: updatedSignatureUrl };
				toast.success("You've added your signature!");
				setUser(updatedUser);

				setSignature(null);
			}
		} catch (error) {
			console.error("Error uploading image:", error);
			toast.error("Error uploading image");
		} finally {
			setSavingSig(false);
		}
	};

	return (
		<Card>
			<CardContent>
				<Box
					sx={{
						alignItems: "center",
						display: "flex",
						flexDirection: "column",
					}}
				>
					<Avatar
						src={user?.photoUrl}
						sx={{
							height: 80,
							mb: 2,
							width: 80,
						}}
					/>
					<Typography gutterBottom variant="h5">
						{user?.name}
					</Typography>
					<Typography color="text.secondary" variant="body2">
						{user?.email}
					</Typography>
					<Typography variant="body2">
						Role:{" "}
						{Array.isArray(user?.position)
							? user.position
									.slice(0, 2)
									.map((pos) => capitalizeFirstLetter(pos))
									.join(", ")
							: ""}
					</Typography>
				</Box>
			</CardContent>

			{/* <Divider /> */}

			<CardActions>
				<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
					<Button
						variant="outlined"
						color="info"
						onClick={() => document.getElementById("upload-button").click()}
					>
						Upload picture
					</Button>
					<input
						accept=".png, .jpg, .jpeg" // Updated to use proper format for file types
						style={{ display: "none" }}
						id="upload-button"
						type="file"
						onChange={handleImageChange}
					/>
				</Box>
			</CardActions>

			{image && (
				<Box sx={{ display: "flex", justifyContent: "space-around" }}>
					<img
						src={URL.createObjectURL(image)}
						alt="Preview"
						style={{ width: "50px", height: "50px", marginLeft: "10px" }}
					/>
					<Button
						variant="text"
						color="success"
						onClick={handleImageUpload}
						disabled={saving}
					>
						{saving ? "Saving..." : "Save Picture"}
					</Button>
					<Button color="error" onClick={() => setImage(null)}>
						<Cancel />
					</Button>
				</Box>
			)}

			<hr />

			<Container>
				<Box
					sx={{ display: "flex", justifyContent: "center", flexDirection: "column" }}
				></Box>

				<Box sx={{ display: "flex", justifyContent: "center" }}>
					<figure>
						<figcaption>
							<Typography color="text.secondary" variant="body2">
								Your Signature
							</Typography>
						</figcaption>
						<img src={user?.signatureUrl} alt="" width={100} />
					</figure>
				</Box>

				<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
					<Button
						variant="text"
						color="info"
						sx={{ textAlign: "center" }}
						onClick={() => document.getElementById("upload-sig-button").click()}
					>
						Upload Signature
					</Button>
					<input
						accept=".png, .jpg, .jpeg" // Updated to use proper format for file types
						style={{ display: "none" }}
						id="upload-sig-button"
						type="file"
						onChange={handleSignatureChange}
					/>
				</Box>

				<Divider sx={{ my: 2 }} />

				{signature && (
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<img
							src={URL.createObjectURL(signature)}
							alt="Preview"
							style={{ width: "80px", height: "50px", marginLeft: "10px" }}
						/>
						<Button
							variant="text"
							color="success"
							onClick={handleSignatureUpload}
							disabled={savingSig}
						>
							{savingSig ? "Saving..." : "Save Signature"}
						</Button>
						<Button color="error" onClick={() => setSignature(null)}>
							<Cancel />
						</Button>
					</Box>
				)}
			</Container>
		</Card>
	);
};
