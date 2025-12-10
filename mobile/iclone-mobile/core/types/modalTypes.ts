/**
 * Use this when you have exactly one modal for each of the type that  you are using on your screen/component
 */
export type ModalType = "none" | "loading" | "success" | "error" | "confirm";

/**
 * Use this when you have multiple modals for a certain type 
 * You need to manually assign modals for each index (via conditional rendering)
*/
export type ModalState = {
  type: ModalType,
  index: number
}