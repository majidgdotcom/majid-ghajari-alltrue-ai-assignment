import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../stateManagement/store";
import SupportRequestForm from "./SupportRequestForm";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
} from "@mui/material";

const SupportRequests: React.FC = () => {
    const formData = useSelector((state: RootState) => state.form);

    return (
        <Box p={4} maxWidth={900} mx="auto">
            <SupportRequestForm />
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Submitted Support Requests
                </Typography>

                {formData.length === 0 ? (
                    <Typography color="textSecondary">No requests submitted yet.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {formData.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="h6">{item.fullName}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {item.email}
                                        </Typography>
                                        <Typography variant="subtitle2" mt={1}>
                                            Issue Type: <strong>{item.issueType}</strong>
                                        </Typography>
                                        <Box mt={1}>
                                            {item.tags.map((tag, idx) => (
                                                <Chip key={idx} label={tag} sx={{ mr: 1, mb: 1 }} />
                                            ))}
                                        </Box>
                                        <Typography variant="subtitle2" mt={2}>
                                            Steps to Reproduce:
                                        </Typography>
                                        <ul style={{ marginTop: 0, paddingLeft: "1.5rem" }}>
                                            {item.steps.map((step, idx) => (
                                                <li key={idx}>
                                                    <Typography variant="body2">{step.step}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Box>
    );
};

export default SupportRequests;