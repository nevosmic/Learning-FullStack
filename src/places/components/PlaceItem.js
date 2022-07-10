import React, { Fragment, useState, useContext } from "react";

import Button from "../../shared/components/FormElements/Button/Button";
import Card from "../../shared/components/UIElements/Card/Card";
import Modal from "../../shared/components/UIElements/Modal/Modal";
import Map from "../../shared/components/UIElements/Map/Map";
import { AuthContext } from "../../shared/components/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner/LoadingSpinner";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const openMapModalHandler = () => setShowMapModal(true);
  const closeMapModalHandler = () => setShowMapModal(false);

  const openDeleteModalHandler = () => setShowDeleteModal(true);
  const closeDeleteModalHandler = () => setShowDeleteModal(false);

  const confirmDeleteHandler = async () => {
    setShowDeleteModal(false);
    console.log("DELETING...");
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      console.log(response);
      // update this user places (I want to re-load current page)
      props.onDelete(props.id);
    } catch (err) {
      console.log(err.message);
    }
  };
  /*  <iframe
            title="map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={
              "https://maps.google.com/maps?q=" +
              props.coordinates.lat.toString() +
              "," +
              props.coordinates.lng.toString() +
              "&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          /> 
          
          <script
            type="text/javascript"
            src="https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165"
          ></script>*/

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMapModal}
        onCancel={closeMapModalHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapModalHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <iframe
            title="map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={
              "https://maps.google.com/maps?q=" +
              props.coordinates.lat.toString() +
              "," +
              props.coordinates.lng.toString() +
              "&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          ></iframe>
          <script
            type="text/javascript"
            src="${process.env.REACT_APP_GOOGLE_MAP_SRC}"
          ></script>
        </div>
      </Modal>

      <Modal
        show={showDeleteModal}
        onCancel={closeDeleteModalHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <Fragment>
            <Button inverse onClick={closeDeleteModalHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay={true} />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_ASSET_URL}/${props.imagePath}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapModalHandler}>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={openDeleteModalHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </Fragment>
  );
};
export default PlaceItem;
/*<Modal
        show={showMapModal}
        onCancel={closeMapModalHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapModalHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal> */
