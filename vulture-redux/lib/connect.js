const defaultMapStateToData = () => ({})
const defaultMapDispatchToData = dispatch => ({ dispatch })
const defaultMergeData = (stateData, dispatchData, data) => ({
  ...data,
  ...stateData,
  ...dispatchData
})

export default function connect(
  mapStateToData = defaultMapStateToData,
  mapDispatchToData = defaultMapDispatchToData,
  mergeData = defaultMergeData
) {
  return component => function connectedComponent(data, ...args) {
    if (!data || !data.store.dispatch || !data.store.getState) {
      throw new Error('To connect to redux, the first argument must be an object with a store property.')
    }

    const { store: { getState, dispatch } } = data
    const state = getState()
    const stateData = mapStateToData(state)
    const dispatchData = mapDispatchToData(dispatch)
    const mergedData = mergeData(stateData, dispatchData, data)

    return this::component(mergedData, ...args)
  }
}
