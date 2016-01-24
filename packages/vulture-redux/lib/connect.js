const defaultMapStateToData = () => ({})
const defaultMapDispatchToData = dispatch => ({ dispatch })
const defaultMergeData = (stateData, dispatchData, parentData) => ({
  ...stateData,
  ...dispatchData,
  ...parentData
})

export default function connect(
  mapStateToData = defaultMapStateToData,
  mapDispatchToData = defaultMapDispatchToData,
  mergeData = defaultMergeData
) {
  return component => function connectedComponent(data, ...args) {
    if (!data || !data.store.dispatch || !data.store.getState) {
      throw new Error('Function must be passed an object containing a redux store.')
    }

    const { store: { getState, dispatch } } = data
    return this::component(mergeData(mapStateToData(getState()), mapDispatchToData(dispatch), data), ...args)
  }
}
