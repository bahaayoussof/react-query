import { Link, Outlet, useNavigate } from "react-router-dom";

import Header from "../Header.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: event,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate: deleteEventHandler, isPending: deleteLoading } = useMutation({
    mutationFn: () => deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries("events");
      navigate("../");
    },
  });

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content">
        <p className="center">Loading event details...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content">
        <ErrorBlock
          title="Failed to load event"
          message={error.info?.message || "An error occurred"}
        />
      </div>
    );
  }

  if (event) {
    content = (
      <>
        <header>
          <h1>{event.title}</h1>
          <nav>
            {!deleteLoading ? (
              <>
                <button onClick={deleteEventHandler}>Delete</button>
                <Link to="edit" state={{ event }}>
                  Edit
                </Link>
              </>
            ) : (
              "Deleting..."
            )}
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:8080/${event.image}`} alt={event.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{event.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {event.date} @ {event.time}
              </time>
            </div>
            <p id="event-details-description">{event.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>

      <article id="event-details">{content}</article>
    </>
  );
}
