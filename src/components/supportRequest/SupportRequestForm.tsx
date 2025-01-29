import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SupportRequestData } from "../../interfaces/ISupportRequest";
import { useDispatch } from "react-redux";
import { submitSupportRequest } from "../../stateManagement/supportRequestSlice";

const schema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  issueType: z.enum(["General Inquiry", "Feature Request", "Bug Report"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  steps: z
    .array(z.object({ step: z.string().min(1, "Step is required") }))
    .min(1, "At least one step is required"),
});

const SupportRequestForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { control, handleSubmit, register, setValue, watch, reset } = useForm<SupportRequestData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      issueType: "Bug Report",
      tags: [],
      steps: [{ step: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const onSubmit = (data: SupportRequestData) => {
    console.log("Submitted Data:", data);
    dispatch(submitSupportRequest(data));
    reset();
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Submit Support Request
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Submit Support Request
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField {...register("fullName")} label="Full Name" fullWidth margin="normal" />
            <TextField {...register("email")} label="Email" type="email" fullWidth margin="normal" />
            <TextField {...register("issueType")} select fullWidth margin="normal" label="Issue Type">
              <MenuItem value="Bug Report">Bug Report</MenuItem>
              <MenuItem value="Feature Request">Feature Request</MenuItem>
              <MenuItem value="General Inquiry">General Inquiry</MenuItem>
            </TextField>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  value={field.value.join(", ")}
                  onChange={(e) => setValue("tags", e.target.value.split(",").map((tag) => tag.trim()))}
                  margin="normal"
                />
              )}
            />
            <Box mt={2}>
              Steps to Reproduce:
              {fields.map((field, index) => (
                <Box key={field.id} display="flex" alignItems="center" mt={1}>
                  <TextField {...register(`steps.${index}.step`)} fullWidth label={`Step ${index + 1}`} />
                  <Button onClick={() => remove(index)} color="error" sx={{ ml: 1 }}>
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={() => append({ step: "" })} variant="outlined" color="primary" sx={{ mt: 2 }}>
                + Add Step
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SupportRequestForm;
