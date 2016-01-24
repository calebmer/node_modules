const defaultMapStateToData = () => ({})
const defaultMapDispatchToData = dispatch => ({ dispatch })
const defaultMergeData = (stateData, dispatchData, ownData) => ({
  ...ownData,
  ...stateData,
  ...dispatchData
})

export default function connect(
  mapStateToData = defaultMapStateToData,
  mapDispatchToData = defaultMapDispatchToData,
  mergeData = defaultMergeData
) {
  return component => function connectedComponent(ownData, ...args) {
    if (!data || !data.store.dispatch || !data.store.getState) {
      throw new Error('To connect to redux, the first argument must be an object with a store property.')
    }

    const { store: { getState, dispatch } } = ownData
    const state = getState()
    const stateData = mapStateToData(state, ownData)
    const dispatchData = mapDispatchToData(dispatch, ownData)
    const mergedData = mergeData(stateData, dispatchData, ownData)

    return component.call(this, mergedData, ...args)
  }
}
