import {
  Link,
  redirect,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useParams } from "react-router-dom";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import { useMutation, useQuery } from "@tanstack/react-query";
// import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const { id } = useParams();

  const isSubmitting = navigation.state === "submitting";

  const {
    data: event,
    // isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    staleTime: 10000,
  });

  const { mutate: updateEventHandler } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await queryClient.cancelQueries({ queryKey: ["events", id] });
      const previousEvent = queryClient.getQueryData(["events", id]);

      queryClient.setQueryData(["events", id], newEvent);

      return { previousEvent };
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(["events", id], context.previousEvent);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["events", id]);
    },
  });

  function handleSubmit(formData) {
    // updateEventHandler({ id, event: formData });
    // navigate("../");

    submit(formData, { method: "PUT" });
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  // if (isPending) {
  //   content = (
  //     <div className="center">
  //       <LoadingIndicator />
  //     </div>
  //   );
  // }

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event."
          message={
            error.info?.message ||
            "Failed to load event details. Please try again later."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Oky
          </Link>
        </div>
      </>
    );
  }

  if (event) {
    content = (
      <EventForm inputData={event} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update"}
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(["events"]);

  return redirect("../");
}
