(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/useIsDateDisabled.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsDateDisabled",
    ()=>useIsDateDisabled
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$validation$2f$validateDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/validation/validateDate.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/hooks/usePickerAdapter.js [app-client] (ecmascript)");
'use client';
;
;
;
const useIsDateDisabled = ({ shouldDisableDate, shouldDisableMonth, shouldDisableYear, minDate, maxDate, disableFuture, disablePast, timezone })=>{
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerAdapter"])();
    return __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useIsDateDisabled.useCallback": (day)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$validation$2f$validateDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateDate"])({
                adapter,
                value: day,
                timezone,
                props: {
                    shouldDisableDate,
                    shouldDisableMonth,
                    shouldDisableYear,
                    minDate,
                    maxDate,
                    disableFuture,
                    disablePast
                }
            }) !== null
    }["useIsDateDisabled.useCallback"], [
        adapter,
        shouldDisableDate,
        shouldDisableMonth,
        shouldDisableYear,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        timezone
    ]);
};
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/useCalendarState.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCalendarState",
    ()=>useCalendarState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useIsDateDisabled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/useIsDateDisabled.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$valueManagers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/valueManagers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$getDefaultReferenceDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/getDefaultReferenceDate.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/date-utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/hooks/usePickerAdapter.js [app-client] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
const createCalendarStateReducer = (reduceAnimations, adapter)=>(state, action)=>{
        switch(action.type){
            case 'setVisibleDate':
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, state, {
                    slideDirection: action.direction,
                    currentMonth: action.month,
                    isMonthSwitchingAnimating: !adapter.isSameMonth(action.month, state.currentMonth) && !reduceAnimations && !action.skipAnimation,
                    focusedDay: action.focusedDay
                });
            case 'changeMonthTimezone':
                {
                    const newTimezone = action.newTimezone;
                    if (adapter.getTimezone(state.currentMonth) === newTimezone) {
                        return state;
                    }
                    let newCurrentMonth = adapter.setTimezone(state.currentMonth, newTimezone);
                    if (adapter.getMonth(newCurrentMonth) !== adapter.getMonth(state.currentMonth)) {
                        newCurrentMonth = adapter.setMonth(newCurrentMonth, adapter.getMonth(state.currentMonth));
                    }
                    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, state, {
                        currentMonth: newCurrentMonth
                    });
                }
            case 'finishMonthSwitchingAnimation':
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, state, {
                    isMonthSwitchingAnimating: false
                });
            default:
                throw new Error('missing support');
        }
    };
const useCalendarState = (params)=>{
    const { value, referenceDate: referenceDateProp, disableFuture, disablePast, maxDate, minDate, onMonthChange, onYearChange, reduceAnimations, shouldDisableDate, timezone, getCurrentMonthFromVisibleDate } = params;
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerAdapter"])();
    const reducerFn = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](createCalendarStateReducer(Boolean(reduceAnimations), adapter)).current;
    const referenceDate = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useCalendarState.useMemo[referenceDate]": ()=>{
            return __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$valueManagers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["singleItemValueManager"].getInitialReferenceValue({
                value,
                adapter,
                timezone,
                props: params,
                referenceDate: referenceDateProp,
                granularity: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$getDefaultReferenceDate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECTION_TYPE_GRANULARITY"].day
            });
        }
    }["useCalendarState.useMemo[referenceDate]"], // We want the `referenceDate` to update on prop and `timezone` change (https://github.com/mui/mui-x/issues/10804)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
        referenceDateProp,
        timezone
    ]);
    const [calendarState, dispatch] = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducer"](reducerFn, {
        isMonthSwitchingAnimating: false,
        focusedDay: referenceDate,
        currentMonth: adapter.startOfMonth(referenceDate),
        slideDirection: 'left'
    });
    const isDateDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useIsDateDisabled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsDateDisabled"])({
        shouldDisableDate,
        minDate,
        maxDate,
        disableFuture,
        disablePast,
        timezone
    });
    // Ensure that `calendarState.currentMonth` timezone is updated when `referenceDate` (or timezone changes)
    // https://github.com/mui/mui-x/issues/10804
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useCalendarState.useEffect": ()=>{
            dispatch({
                type: 'changeMonthTimezone',
                newTimezone: adapter.getTimezone(referenceDate)
            });
        }
    }["useCalendarState.useEffect"], [
        referenceDate,
        adapter
    ]);
    const setVisibleDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "useCalendarState.useEventCallback[setVisibleDate]": ({ target, reason })=>{
            if (reason === 'cell-interaction' && calendarState.focusedDay != null && adapter.isSameDay(target, calendarState.focusedDay)) {
                return;
            }
            const skipAnimation = reason === 'cell-interaction';
            let month;
            let focusedDay;
            if (reason === 'cell-interaction') {
                month = getCurrentMonthFromVisibleDate(target, calendarState.currentMonth);
                focusedDay = target;
            } else {
                month = adapter.isSameMonth(target, calendarState.currentMonth) ? calendarState.currentMonth : adapter.startOfMonth(target);
                focusedDay = target;
                // If the date is disabled, we try to find a non-disabled date inside the same month.
                if (isDateDisabled(focusedDay)) {
                    const startOfMonth = adapter.startOfMonth(target);
                    const endOfMonth = adapter.endOfMonth(target);
                    focusedDay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findClosestEnabledDate"])({
                        adapter,
                        date: focusedDay,
                        minDate: adapter.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
                        maxDate: adapter.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
                        disablePast,
                        disableFuture,
                        isDateDisabled,
                        timezone
                    });
                }
            }
            const hasChangedMonth = !adapter.isSameMonth(calendarState.currentMonth, month);
            const hasChangedYear = !adapter.isSameYear(calendarState.currentMonth, month);
            if (hasChangedMonth) {
                onMonthChange?.(month);
            }
            if (hasChangedYear) {
                onYearChange?.(adapter.startOfYear(month));
            }
            dispatch({
                type: 'setVisibleDate',
                month,
                direction: adapter.isAfterDay(month, calendarState.currentMonth) ? 'left' : 'right',
                focusedDay: calendarState.focusedDay != null && focusedDay != null && adapter.isSameDay(focusedDay, calendarState.focusedDay) ? calendarState.focusedDay : focusedDay,
                skipAnimation
            });
        }
    }["useCalendarState.useEventCallback[setVisibleDate]"]);
    const onMonthSwitchingAnimationEnd = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useCalendarState.useCallback[onMonthSwitchingAnimationEnd]": ()=>{
            dispatch({
                type: 'finishMonthSwitchingAnimation'
            });
        }
    }["useCalendarState.useCallback[onMonthSwitchingAnimationEnd]"], []);
    return {
        referenceDate,
        calendarState,
        setVisibleDate,
        isDateDisabled,
        onMonthSwitchingAnimationEnd
    };
};
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/pickersFadeTransitionGroupClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPickersFadeTransitionGroupUtilityClass",
    ()=>getPickersFadeTransitionGroupUtilityClass,
    "pickersFadeTransitionGroupClasses",
    ()=>pickersFadeTransitionGroupClasses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js [app-client] (ecmascript)");
;
;
const getPickersFadeTransitionGroupUtilityClass = (slot)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiPickersFadeTransitionGroup', slot);
const pickersFadeTransitionGroupClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiPickersFadeTransitionGroup', [
    'root'
]);
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/PickersFadeTransitionGroup.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PickersFadeTransitionGroup",
    ()=>PickersFadeTransitionGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TransitionGroup$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/react-transition-group/esm/TransitionGroup.js [app-client] (ecmascript) <export default as TransitionGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Fade$2f$Fade$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/Fade/Fade.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/styled.js [app-client] (ecmascript) <locals> <export default as styled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useThemeProps.js [app-client] (ecmascript) <export default as useThemeProps>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersFadeTransitionGroupClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/pickersFadeTransitionGroupClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
const _excluded = [
    "children"
];
;
;
;
;
;
;
;
;
const useUtilityClasses = (classes)=>{
    const slots = {
        root: [
            'root'
        ]
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(slots, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersFadeTransitionGroupClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPickersFadeTransitionGroupUtilityClass"], classes);
};
const PickersFadeTransitionGroupRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TransitionGroup$3e$__["TransitionGroup"], {
    name: 'MuiPickersFadeTransitionGroup',
    slot: 'Root'
})({
    display: 'block',
    position: 'relative'
});
function PickersFadeTransitionGroup(inProps) {
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__["useThemeProps"])({
        props: inProps,
        name: 'MuiPickersFadeTransitionGroup'
    });
    const { className, reduceAnimations, transKey, classes: classesProp } = props;
    const { children } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const classes = useUtilityClasses(classesProp);
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    if (reduceAnimations) {
        return children;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersFadeTransitionGroupRoot, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(classes.root, className),
        ownerState: other,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Fade$2f$Fade$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            appear: false,
            mountOnEnter: true,
            unmountOnExit: true,
            timeout: {
                appear: theme.transitions.duration.enteringScreen,
                enter: theme.transitions.duration.enteringScreen,
                exit: 0
            },
            children: children
        }, transKey)
    });
}
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/pickersSlideTransitionClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPickersSlideTransitionUtilityClass",
    ()=>getPickersSlideTransitionUtilityClass,
    "pickersSlideTransitionClasses",
    ()=>pickersSlideTransitionClasses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js [app-client] (ecmascript)");
;
;
const getPickersSlideTransitionUtilityClass = (slot)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiPickersSlideTransition', slot);
const pickersSlideTransitionClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiPickersSlideTransition', [
    'root',
    'slideEnter-left',
    'slideEnter-right',
    'slideEnterActive',
    'slideExit',
    'slideExitActiveLeft-left',
    'slideExitActiveLeft-right'
]);
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/PickersSlideTransition.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PickersSlideTransition",
    ()=>PickersSlideTransition
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/styled.js [app-client] (ecmascript) <locals> <export default as styled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useTheme.js [app-client] (ecmascript) <export default as useTheme>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useThemeProps.js [app-client] (ecmascript) <export default as useThemeProps>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$CSSTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CSSTransition$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/react-transition-group/esm/CSSTransition.js [app-client] (ecmascript) <export default as CSSTransition>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TransitionGroup$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/react-transition-group/esm/TransitionGroup.js [app-client] (ecmascript) <export default as TransitionGroup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/pickersSlideTransitionClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$usePickerPrivateContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/usePickerPrivateContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
const _excluded = [
    "children",
    "className",
    "reduceAnimations",
    "slideDirection",
    "transKey",
    "classes"
];
;
;
;
;
;
;
;
;
const useUtilityClasses = (classes, ownerState)=>{
    const { slideDirection } = ownerState;
    const slots = {
        root: [
            'root'
        ],
        exit: [
            'slideExit'
        ],
        enterActive: [
            'slideEnterActive'
        ],
        enter: [
            `slideEnter-${slideDirection}`
        ],
        exitActive: [
            `slideExitActiveLeft-${slideDirection}`
        ]
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(slots, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPickersSlideTransitionUtilityClass"], classes);
};
const PickersSlideTransitionRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$TransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TransitionGroup$3e$__["TransitionGroup"], {
    name: 'MuiPickersSlideTransition',
    slot: 'Root',
    overridesResolver: (_, styles)=>[
            styles.root,
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideEnter-left']}`]: styles['slideEnter-left']
            },
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideEnter-right']}`]: styles['slideEnter-right']
            },
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"].slideEnterActive}`]: styles.slideEnterActive
            },
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"].slideExit}`]: styles.slideExit
            },
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideExitActiveLeft-left']}`]: styles['slideExitActiveLeft-left']
            },
            {
                [`.${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideExitActiveLeft-right']}`]: styles['slideExitActiveLeft-right']
            }
        ]
})(({ theme })=>{
    const slideTransition = theme.transitions.create('transform', {
        duration: theme.transitions.duration.complex,
        easing: 'cubic-bezier(0.35, 0.8, 0.4, 1)'
    });
    return {
        display: 'block',
        position: 'relative',
        overflowX: 'hidden',
        '& > *': {
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideEnter-left']}`]: {
            willChange: 'transform',
            transform: 'translate(100%)',
            zIndex: 1
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideEnter-right']}`]: {
            willChange: 'transform',
            transform: 'translate(-100%)',
            zIndex: 1
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"].slideEnterActive}`]: {
            transform: 'translate(0%)',
            transition: slideTransition
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"].slideExit}`]: {
            transform: 'translate(0%)'
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideExitActiveLeft-left']}`]: {
            willChange: 'transform',
            transform: 'translate(-100%)',
            transition: slideTransition,
            zIndex: 0
        },
        [`& .${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$pickersSlideTransitionClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pickersSlideTransitionClasses"]['slideExitActiveLeft-right']}`]: {
            willChange: 'transform',
            transform: 'translate(100%)',
            transition: slideTransition,
            zIndex: 0
        }
    };
});
function PickersSlideTransition(inProps) {
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__["useThemeProps"])({
        props: inProps,
        name: 'MuiPickersSlideTransition'
    });
    const { children, className, reduceAnimations, slideDirection, transKey, classes: classesProp } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const { ownerState: pickerOwnerState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$usePickerPrivateContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerPrivateContext"])();
    const ownerState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, pickerOwnerState, {
        slideDirection
    });
    const classes = useUtilityClasses(classesProp, ownerState);
    const theme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useTheme$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useTheme$3e$__["useTheme"])();
    if (reduceAnimations) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(classes.root, className),
            children: children
        });
    }
    const transitionClasses = {
        exit: classes.exit,
        enterActive: classes.enterActive,
        enter: classes.enter,
        exitActive: classes.exitActive
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersSlideTransitionRoot, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(classes.root, className),
        childFactory: (element)=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cloneElement"](element, {
                classNames: transitionClasses
            }),
        role: "presentation",
        ownerState: ownerState,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$react$2d$transition$2d$group$2f$esm$2f$CSSTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CSSTransition$3e$__["CSSTransition"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            mountOnEnter: true,
            unmountOnExit: true,
            timeout: theme.transitions.duration.complex,
            classNames: transitionClasses
        }, other, {
            children: children
        }), transKey)
    });
}
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/dayCalendarClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dayCalendarClasses",
    ()=>dayCalendarClasses,
    "getDayCalendarUtilityClass",
    ()=>getDayCalendarUtilityClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js [app-client] (ecmascript)");
;
;
const getDayCalendarUtilityClass = (slot)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiDayCalendar', slot);
const dayCalendarClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiDayCalendar', [
    'root',
    'header',
    'weekDayLabel',
    'loadingContainer',
    'slideTransition',
    'monthContainer',
    'weekContainer',
    'weekNumberLabel',
    'weekNumber'
]);
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/DayCalendar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DayCalendar",
    ()=>DayCalendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/Typography/Typography.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useSlotProps$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useSlotProps/useSlotProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$RtlProvider$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/system/esm/RtlProvider/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/styled.js [app-client] (ecmascript) <locals> <export default as styled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useThemeProps.js [app-client] (ecmascript) <export default as useThemeProps>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersDay$2f$PickersDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/PickersDay/PickersDay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/hooks/usePickerAdapter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerTranslations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/hooks/usePickerTranslations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/useUtils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/constants/dimensions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$PickersSlideTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/PickersSlideTransition.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useIsDateDisabled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/useIsDateDisabled.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/date-utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$dayCalendarClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/dayCalendarClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersDay$2f$usePickerDayOwnerState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/PickersDay/usePickerDayOwnerState.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const _excluded = [
    "parentProps",
    "day",
    "focusedDay",
    "selectedDays",
    "isDateDisabled",
    "currentMonthNumber",
    "isViewFocused"
], _excluded2 = [
    "ownerState"
];
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const useUtilityClasses = (classes)=>{
    const slots = {
        root: [
            'root'
        ],
        header: [
            'header'
        ],
        weekDayLabel: [
            'weekDayLabel'
        ],
        loadingContainer: [
            'loadingContainer'
        ],
        slideTransition: [
            'slideTransition'
        ],
        monthContainer: [
            'monthContainer'
        ],
        weekContainer: [
            'weekContainer'
        ],
        weekNumberLabel: [
            'weekNumberLabel'
        ],
        weekNumber: [
            'weekNumber'
        ]
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(slots, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$dayCalendarClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDayCalendarUtilityClass"], classes);
};
const weeksContainerHeight = (__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_SIZE"] + __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_MARGIN"] * 2) * 6;
const PickersCalendarDayRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])('div', {
    name: 'MuiDayCalendar',
    slot: 'Root'
})({});
const PickersCalendarDayHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])('div', {
    name: 'MuiDayCalendar',
    slot: 'Header'
})({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});
const PickersCalendarWeekDayLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
    name: 'MuiDayCalendar',
    slot: 'WeekDayLabel'
})(({ theme })=>({
        width: 36,
        height: 40,
        margin: '0 2px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: (theme.vars || theme).palette.text.secondary
    }));
const PickersCalendarWeekNumberLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
    name: 'MuiDayCalendar',
    slot: 'WeekNumberLabel'
})(({ theme })=>({
        width: 36,
        height: 40,
        margin: '0 2px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: (theme.vars || theme).palette.text.disabled
    }));
const PickersCalendarWeekNumber = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Typography$2f$Typography$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
    name: 'MuiDayCalendar',
    slot: 'WeekNumber'
})(({ theme })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, theme.typography.caption, {
        width: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_SIZE"],
        height: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_SIZE"],
        padding: 0,
        margin: `0 ${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_MARGIN"]}px`,
        color: (theme.vars || theme).palette.text.disabled,
        fontSize: '0.75rem',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'inline-flex'
    }));
const PickersCalendarLoadingContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])('div', {
    name: 'MuiDayCalendar',
    slot: 'LoadingContainer'
})({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: weeksContainerHeight
});
const PickersCalendarSlideTransition = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$PickersSlideTransition$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickersSlideTransition"], {
    name: 'MuiDayCalendar',
    slot: 'SlideTransition'
})({
    minHeight: weeksContainerHeight
});
const PickersCalendarWeekContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])('div', {
    name: 'MuiDayCalendar',
    slot: 'MonthContainer'
})({
    overflow: 'hidden'
});
const PickersCalendarWeek = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])('div', {
    name: 'MuiDayCalendar',
    slot: 'WeekContainer'
})({
    margin: `${__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DAY_MARGIN"]}px 0`,
    display: 'flex',
    justifyContent: 'center'
});
function WrappedDay(_ref) {
    let { parentProps, day, focusedDay, selectedDays, isDateDisabled, currentMonthNumber, isViewFocused } = _ref, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_ref, _excluded);
    const { disabled, disableHighlightToday, isMonthSwitchingAnimating, showDaysOutsideCurrentMonth, slots, slotProps, timezone } = parentProps;
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerAdapter"])();
    const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNow"])(timezone);
    const isFocusableDay = focusedDay != null && adapter.isSameDay(day, focusedDay);
    const isFocusedDay = isViewFocused && isFocusableDay;
    const isSelected = selectedDays.some((selectedDay)=>adapter.isSameDay(selectedDay, day));
    const isToday = adapter.isSameDay(day, now);
    const isDisabled = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WrappedDay.useMemo[isDisabled]": ()=>disabled || isDateDisabled(day)
    }["WrappedDay.useMemo[isDisabled]"], [
        disabled,
        isDateDisabled,
        day
    ]);
    const isOutsideCurrentMonth = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WrappedDay.useMemo[isOutsideCurrentMonth]": ()=>adapter.getMonth(day) !== currentMonthNumber
    }["WrappedDay.useMemo[isOutsideCurrentMonth]"], [
        adapter,
        day,
        currentMonthNumber
    ]);
    const ownerState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersDay$2f$usePickerDayOwnerState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerDayOwnerState"])({
        day,
        selected: isSelected,
        disabled: isDisabled,
        today: isToday,
        outsideCurrentMonth: isOutsideCurrentMonth,
        disableMargin: undefined,
        // This prop can only be defined using slotProps.day so the ownerState for useSlotProps cannot have its value.
        disableHighlightToday,
        showDaysOutsideCurrentMonth
    });
    const Day = slots?.day ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersDay$2f$PickersDay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickersDay"];
    // We don't want to pass to ownerState down, to avoid re-rendering all the day whenever a prop changes.
    const _useSlotProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useSlotProps$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        elementType: Day,
        externalSlotProps: slotProps?.day,
        additionalProps: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            disableHighlightToday,
            showDaysOutsideCurrentMonth,
            role: 'gridcell',
            isAnimating: isMonthSwitchingAnimating,
            // it is used in date range dragging logic by accessing `dataset.timestamp`
            'data-timestamp': adapter.toJsDate(day).valueOf()
        }, other),
        ownerState: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, ownerState, {
            day,
            isDayDisabled: isDisabled,
            isDaySelected: isSelected
        })
    }), dayProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(_useSlotProps, _excluded2);
    const isFirstVisibleCell = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WrappedDay.useMemo[isFirstVisibleCell]": ()=>{
            const startOfMonth = adapter.startOfMonth(adapter.setMonth(day, currentMonthNumber));
            if (!showDaysOutsideCurrentMonth) {
                return adapter.isSameDay(day, startOfMonth);
            }
            return adapter.isSameDay(day, adapter.startOfWeek(startOfMonth));
        }
    }["WrappedDay.useMemo[isFirstVisibleCell]"], [
        currentMonthNumber,
        day,
        showDaysOutsideCurrentMonth,
        adapter
    ]);
    const isLastVisibleCell = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WrappedDay.useMemo[isLastVisibleCell]": ()=>{
            const endOfMonth = adapter.endOfMonth(adapter.setMonth(day, currentMonthNumber));
            if (!showDaysOutsideCurrentMonth) {
                return adapter.isSameDay(day, endOfMonth);
            }
            return adapter.isSameDay(day, adapter.endOfWeek(endOfMonth));
        }
    }["WrappedDay.useMemo[isLastVisibleCell]"], [
        currentMonthNumber,
        day,
        showDaysOutsideCurrentMonth,
        adapter
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(Day, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, dayProps, {
        day: day,
        disabled: isDisabled,
        autoFocus: !isOutsideCurrentMonth && isFocusedDay,
        today: isToday,
        outsideCurrentMonth: isOutsideCurrentMonth,
        isFirstVisibleCell: isFirstVisibleCell,
        isLastVisibleCell: isLastVisibleCell,
        selected: isSelected,
        tabIndex: isFocusableDay ? 0 : -1,
        "aria-selected": isSelected,
        "aria-current": isToday ? 'date' : undefined
    }));
}
function DayCalendar(inProps) {
    const props = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__["useThemeProps"])({
        props: inProps,
        name: 'MuiDayCalendar'
    });
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerAdapter"])();
    const { onFocusedDayChange, className, classes: classesProp, currentMonth, selectedDays, focusedDay, loading, onSelectedDaysChange, onMonthSwitchingAnimationEnd, readOnly, reduceAnimations, renderLoading = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
            children: "..."
        }), slideDirection, TransitionProps, disablePast, disableFuture, minDate, maxDate, shouldDisableDate, shouldDisableMonth, shouldDisableYear, dayOfWeekFormatter = (date)=>adapter.format(date, 'weekdayShort').charAt(0).toUpperCase(), hasFocus, onFocusedViewChange, gridLabelId, displayWeekNumber, fixedWeekNumber, timezone } = props;
    const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useUtils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNow"])(timezone);
    const classes = useUtilityClasses(classesProp);
    const isRtl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$system$2f$esm$2f$RtlProvider$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRtl"])();
    const isDateDisabled = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useIsDateDisabled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsDateDisabled"])({
        shouldDisableDate,
        shouldDisableMonth,
        shouldDisableYear,
        minDate,
        maxDate,
        disablePast,
        disableFuture,
        timezone
    });
    const translations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerTranslations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerTranslations"])();
    const handleDaySelect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DayCalendar.useEventCallback[handleDaySelect]": (day)=>{
            if (readOnly) {
                return;
            }
            onSelectedDaysChange(day);
        }
    }["DayCalendar.useEventCallback[handleDaySelect]"]);
    const focusDay = (day)=>{
        if (!isDateDisabled(day)) {
            onFocusedDayChange(day);
            onFocusedViewChange?.(true);
        }
    };
    const handleKeyDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DayCalendar.useEventCallback[handleKeyDown]": (event, day)=>{
            switch(event.key){
                case 'ArrowUp':
                    focusDay(adapter.addDays(day, -7));
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    focusDay(adapter.addDays(day, 7));
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    {
                        const newFocusedDayDefault = adapter.addDays(day, isRtl ? 1 : -1);
                        const nextAvailableMonth = adapter.addMonths(day, isRtl ? 1 : -1);
                        const closestDayToFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findClosestEnabledDate"])({
                            adapter,
                            date: newFocusedDayDefault,
                            minDate: isRtl ? newFocusedDayDefault : adapter.startOfMonth(nextAvailableMonth),
                            maxDate: isRtl ? adapter.endOfMonth(nextAvailableMonth) : newFocusedDayDefault,
                            isDateDisabled,
                            timezone
                        });
                        focusDay(closestDayToFocus || newFocusedDayDefault);
                        event.preventDefault();
                        break;
                    }
                case 'ArrowRight':
                    {
                        const newFocusedDayDefault = adapter.addDays(day, isRtl ? -1 : 1);
                        const nextAvailableMonth = adapter.addMonths(day, isRtl ? -1 : 1);
                        const closestDayToFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findClosestEnabledDate"])({
                            adapter,
                            date: newFocusedDayDefault,
                            minDate: isRtl ? adapter.startOfMonth(nextAvailableMonth) : newFocusedDayDefault,
                            maxDate: isRtl ? newFocusedDayDefault : adapter.endOfMonth(nextAvailableMonth),
                            isDateDisabled,
                            timezone
                        });
                        focusDay(closestDayToFocus || newFocusedDayDefault);
                        event.preventDefault();
                        break;
                    }
                case 'Home':
                    focusDay(adapter.startOfWeek(day));
                    event.preventDefault();
                    break;
                case 'End':
                    focusDay(adapter.endOfWeek(day));
                    event.preventDefault();
                    break;
                case 'PageUp':
                    focusDay(adapter.addMonths(day, 1));
                    event.preventDefault();
                    break;
                case 'PageDown':
                    focusDay(adapter.addMonths(day, -1));
                    event.preventDefault();
                    break;
                default:
                    break;
            }
        }
    }["DayCalendar.useEventCallback[handleKeyDown]"]);
    const handleFocus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DayCalendar.useEventCallback[handleFocus]": (event, day)=>focusDay(day)
    }["DayCalendar.useEventCallback[handleFocus]"]);
    const handleBlur = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DayCalendar.useEventCallback[handleBlur]": (event, day)=>{
            if (focusedDay != null && adapter.isSameDay(focusedDay, day)) {
                onFocusedViewChange?.(false);
            }
        }
    }["DayCalendar.useEventCallback[handleBlur]"]);
    const currentMonthNumber = adapter.getMonth(currentMonth);
    const currentYearNumber = adapter.getYear(currentMonth);
    const validSelectedDays = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DayCalendar.useMemo[validSelectedDays]": ()=>selectedDays.filter({
                "DayCalendar.useMemo[validSelectedDays]": (day)=>!!day
            }["DayCalendar.useMemo[validSelectedDays]"]).map({
                "DayCalendar.useMemo[validSelectedDays]": (day)=>adapter.startOfDay(day)
            }["DayCalendar.useMemo[validSelectedDays]"])
    }["DayCalendar.useMemo[validSelectedDays]"], [
        adapter,
        selectedDays
    ]);
    // need a new ref whenever the `key` of the transition changes: https://reactcommunity.org/react-transition-group/transition/#Transition-prop-nodeRef.
    const transitionKey = `${currentYearNumber}-${currentMonthNumber}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const slideNodeRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DayCalendar.useMemo[slideNodeRef]": ()=>/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRef"]()
    }["DayCalendar.useMemo[slideNodeRef]"], [
        transitionKey
    ]);
    const weeksToDisplay = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DayCalendar.useMemo[weeksToDisplay]": ()=>{
            const toDisplay = adapter.getWeekArray(currentMonth);
            let nextMonth = adapter.addMonths(currentMonth, 1);
            while(fixedWeekNumber && toDisplay.length < fixedWeekNumber){
                const additionalWeeks = adapter.getWeekArray(nextMonth);
                const hasCommonWeek = adapter.isSameDay(toDisplay[toDisplay.length - 1][0], additionalWeeks[0][0]);
                additionalWeeks.slice(hasCommonWeek ? 1 : 0).forEach({
                    "DayCalendar.useMemo[weeksToDisplay]": (week)=>{
                        if (toDisplay.length < fixedWeekNumber) {
                            toDisplay.push(week);
                        }
                    }
                }["DayCalendar.useMemo[weeksToDisplay]"]);
                nextMonth = adapter.addMonths(nextMonth, 1);
            }
            return toDisplay;
        }
    }["DayCalendar.useMemo[weeksToDisplay]"], [
        currentMonth,
        fixedWeekNumber,
        adapter
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(PickersCalendarDayRoot, {
        role: "grid",
        "aria-labelledby": gridLabelId,
        className: classes.root,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(PickersCalendarDayHeader, {
                role: "row",
                className: classes.header,
                children: [
                    displayWeekNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarWeekNumberLabel, {
                        variant: "caption",
                        role: "columnheader",
                        "aria-label": translations.calendarWeekNumberHeaderLabel,
                        className: classes.weekNumberLabel,
                        children: translations.calendarWeekNumberHeaderText
                    }),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWeekdays"])(adapter, now).map((weekday, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarWeekDayLabel, {
                            variant: "caption",
                            role: "columnheader",
                            "aria-label": adapter.format(weekday, 'weekday'),
                            className: classes.weekDayLabel,
                            children: dayOfWeekFormatter(weekday)
                        }, i.toString()))
                ]
            }),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarLoadingContainer, {
                className: classes.loadingContainer,
                children: renderLoading()
            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarSlideTransition, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
                transKey: transitionKey,
                onExited: onMonthSwitchingAnimationEnd,
                reduceAnimations: reduceAnimations,
                slideDirection: slideDirection,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(className, classes.slideTransition)
            }, TransitionProps, {
                nodeRef: slideNodeRef,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarWeekContainer, {
                    ref: slideNodeRef,
                    role: "rowgroup",
                    className: classes.monthContainer,
                    children: weeksToDisplay.map((week, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(PickersCalendarWeek, {
                            role: "row",
                            className: classes.weekContainer,
                            "aria-rowindex": index + 1,
                            children: [
                                displayWeekNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(PickersCalendarWeekNumber, {
                                    className: classes.weekNumber,
                                    role: "rowheader",
                                    "aria-label": translations.calendarWeekNumberAriaLabelText(adapter.getWeekNumber(week[0])),
                                    children: translations.calendarWeekNumberText(adapter.getWeekNumber(week[0]))
                                }),
                                week.map((day, dayIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(WrappedDay, {
                                        parentProps: props,
                                        day: day,
                                        selectedDays: validSelectedDays,
                                        isViewFocused: hasFocus,
                                        focusedDay: focusedDay,
                                        onKeyDown: handleKeyDown,
                                        onFocus: handleFocus,
                                        onBlur: handleBlur,
                                        onDaySelect: handleDaySelect,
                                        isDateDisabled: isDateDisabled,
                                        currentMonthNumber: currentMonthNumber,
                                        "aria-colindex": dayIndex + 1
                                    }, day.toString()))
                            ]
                        }, `week-${week[0]}`))
                })
            }))
        ]
    });
}
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/dateCalendarClasses.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dateCalendarClasses",
    ()=>dateCalendarClasses,
    "getDateCalendarUtilityClass",
    ()=>getDateCalendarUtilityClass
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js [app-client] (ecmascript)");
;
;
const getDateCalendarUtilityClass = (slot)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClass$2f$generateUtilityClass$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiDateCalendar', slot);
const dateCalendarClasses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$generateUtilityClasses$2f$generateUtilityClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('MuiDateCalendar', [
    'root',
    'viewTransitionContainer'
]);
}),
"[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/DateCalendar.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DateCalendar",
    ()=>DateCalendar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@babel/runtime/helpers/esm/extends.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/prop-types/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useSlotProps$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useSlotProps/useSlotProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/styled.js [app-client] (ecmascript) <locals> <export default as styled>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/material/esm/styles/useThemeProps.js [app-client] (ecmascript) <export default as useThemeProps>");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/composeClasses/composeClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useId$2f$useId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useId/useId.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/utils/esm/useEventCallback/useEventCallback.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useCalendarState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/useCalendarState.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$PickersFadeTransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/PickersFadeTransitionGroup.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$DayCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/DayCalendar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$MonthCalendar$2f$MonthCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/MonthCalendar/MonthCalendar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$YearCalendar$2f$YearCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/YearCalendar/YearCalendar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useViews$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/useViews.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersCalendarHeader$2f$PickersCalendarHeader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/PickersCalendarHeader/PickersCalendarHeader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/date-utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$components$2f$PickerViewRoot$2f$PickerViewRoot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/components/PickerViewRoot/PickerViewRoot.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useReduceAnimations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/useReduceAnimations.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$dateCalendarClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/DateCalendar/dateCalendarClasses.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useControlledValue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/useControlledValue.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$valueManagers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/utils/valueManagers.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/constants/dimensions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$usePickerPrivateContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/internals/hooks/usePickerPrivateContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$managers$2f$useDateManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/managers/useDateManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/@mui/x-date-pickers/esm/hooks/usePickerAdapter.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/web-pacientes/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
'use client';
;
;
const _excluded = [
    "autoFocus",
    "onViewChange",
    "value",
    "defaultValue",
    "referenceDate",
    "disableFuture",
    "disablePast",
    "onChange",
    "onYearChange",
    "onMonthChange",
    "reduceAnimations",
    "shouldDisableDate",
    "shouldDisableMonth",
    "shouldDisableYear",
    "view",
    "views",
    "openTo",
    "className",
    "classes",
    "disabled",
    "readOnly",
    "minDate",
    "maxDate",
    "disableHighlightToday",
    "focusedView",
    "onFocusedViewChange",
    "showDaysOutsideCurrentMonth",
    "fixedWeekNumber",
    "dayOfWeekFormatter",
    "slots",
    "slotProps",
    "loading",
    "renderLoading",
    "displayWeekNumber",
    "yearsOrder",
    "yearsPerRow",
    "monthsPerRow",
    "timezone"
];
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const useUtilityClasses = (classes)=>{
    const slots = {
        root: [
            'root'
        ],
        viewTransitionContainer: [
            'viewTransitionContainer'
        ]
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$composeClasses$2f$composeClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(slots, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$dateCalendarClasses$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDateCalendarUtilityClass"], classes);
};
function useDateCalendarDefaultizedProps(props, name) {
    const themeProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$useThemeProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__useThemeProps$3e$__["useThemeProps"])({
        props,
        name
    });
    const reduceAnimations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useReduceAnimations$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReduceAnimations"])(themeProps.reduceAnimations);
    const validationProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$managers$2f$useDateManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApplyDefaultValuesToDateValidationProps"])(themeProps);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, themeProps, validationProps, {
        loading: themeProps.loading ?? false,
        openTo: themeProps.openTo ?? 'day',
        views: themeProps.views ?? [
            'year',
            'day'
        ],
        reduceAnimations,
        renderLoading: themeProps.renderLoading ?? (()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                children: "..."
            }))
    });
}
const DateCalendarRoot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$components$2f$PickerViewRoot$2f$PickerViewRoot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickerViewRoot"], {
    name: 'MuiDateCalendar',
    slot: 'Root'
})({
    display: 'flex',
    flexDirection: 'column',
    height: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$constants$2f$dimensions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VIEW_HEIGHT"]
});
const DateCalendarViewTransitionContainer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$styled$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__styled$3e$__["styled"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$PickersFadeTransitionGroup$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickersFadeTransitionGroup"], {
    name: 'MuiDateCalendar',
    slot: 'ViewTransitionContainer'
})({});
const DateCalendar = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](function DateCalendar(inProps, ref) {
    const adapter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$hooks$2f$usePickerAdapter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerAdapter"])();
    const { ownerState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$usePickerPrivateContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePickerPrivateContext"])();
    const id = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useId$2f$useId$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    const props = useDateCalendarDefaultizedProps(inProps, 'MuiDateCalendar');
    const { autoFocus, onViewChange, value: valueProp, defaultValue, referenceDate: referenceDateProp, disableFuture, disablePast, onChange, onMonthChange, reduceAnimations, shouldDisableDate, shouldDisableMonth, shouldDisableYear, view: inView, views, openTo, className, classes: classesProp, disabled, readOnly, minDate, maxDate, disableHighlightToday, focusedView: focusedViewProp, onFocusedViewChange, showDaysOutsideCurrentMonth, fixedWeekNumber, dayOfWeekFormatter, slots, slotProps, loading, renderLoading, displayWeekNumber, yearsOrder, yearsPerRow, monthsPerRow, timezone: timezoneProp } = props, other = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$objectWithoutPropertiesLoose$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(props, _excluded);
    const { value, handleValueChange, timezone } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useControlledValue$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useControlledValue"])({
        name: 'DateCalendar',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue,
        referenceDate: referenceDateProp,
        onChange,
        valueManager: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$valueManagers$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["singleItemValueManager"]
    });
    const { view, setView, focusedView, setFocusedView, goToNextView, setValueAndGoToNextView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$hooks$2f$useViews$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useViews"])({
        view: inView,
        views,
        openTo,
        onChange: handleValueChange,
        onViewChange,
        autoFocus,
        focusedView: focusedViewProp,
        onFocusedViewChange
    });
    const { referenceDate, calendarState, setVisibleDate, isDateDisabled, onMonthSwitchingAnimationEnd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$useCalendarState$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCalendarState"])({
        value,
        referenceDate: referenceDateProp,
        reduceAnimations,
        onMonthChange,
        minDate,
        maxDate,
        shouldDisableDate,
        disablePast,
        disableFuture,
        timezone,
        getCurrentMonthFromVisibleDate: {
            "DateCalendar.DateCalendar.useCalendarState": (visibleDate, prevMonth)=>{
                if (adapter.isSameMonth(visibleDate, prevMonth)) {
                    return prevMonth;
                }
                return adapter.startOfMonth(visibleDate);
            }
        }["DateCalendar.DateCalendar.useCalendarState"]
    });
    // When disabled, limit the view to the selected date
    const minDateWithDisabled = disabled && value || minDate;
    const maxDateWithDisabled = disabled && value || maxDate;
    const gridLabelId = `${id}-grid-label`;
    const hasFocus = focusedView !== null;
    const CalendarHeader = slots?.calendarHeader ?? __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$PickersCalendarHeader$2f$PickersCalendarHeader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PickersCalendarHeader"];
    const calendarHeaderProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useSlotProps$2f$useSlotProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        elementType: CalendarHeader,
        externalSlotProps: slotProps?.calendarHeader,
        additionalProps: {
            views,
            view,
            currentMonth: calendarState.currentMonth,
            onViewChange: setView,
            onMonthChange: {
                "DateCalendar.DateCalendar.useSlotProps[calendarHeaderProps]": (month)=>setVisibleDate({
                        target: month,
                        reason: 'header-navigation'
                    })
            }["DateCalendar.DateCalendar.useSlotProps[calendarHeaderProps]"],
            minDate: minDateWithDisabled,
            maxDate: maxDateWithDisabled,
            disabled,
            disablePast,
            disableFuture,
            reduceAnimations,
            timezone,
            labelId: gridLabelId
        },
        ownerState
    });
    const handleDateMonthChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DateCalendar.DateCalendar.useEventCallback[handleDateMonthChange]": (newDate)=>{
            const startOfMonth = adapter.startOfMonth(newDate);
            const endOfMonth = adapter.endOfMonth(newDate);
            const closestEnabledDate = isDateDisabled(newDate) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findClosestEnabledDate"])({
                adapter,
                date: newDate,
                minDate: adapter.isBefore(minDate, startOfMonth) ? startOfMonth : minDate,
                maxDate: adapter.isAfter(maxDate, endOfMonth) ? endOfMonth : maxDate,
                disablePast,
                disableFuture,
                isDateDisabled,
                timezone
            }) : newDate;
            if (closestEnabledDate) {
                setValueAndGoToNextView(closestEnabledDate, 'finish');
                setVisibleDate({
                    target: closestEnabledDate,
                    reason: 'cell-interaction'
                });
            } else {
                goToNextView();
                setVisibleDate({
                    target: startOfMonth,
                    reason: 'cell-interaction'
                });
            }
        }
    }["DateCalendar.DateCalendar.useEventCallback[handleDateMonthChange]"]);
    const handleDateYearChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DateCalendar.DateCalendar.useEventCallback[handleDateYearChange]": (newDate)=>{
            const startOfYear = adapter.startOfYear(newDate);
            const endOfYear = adapter.endOfYear(newDate);
            const closestEnabledDate = isDateDisabled(newDate) ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findClosestEnabledDate"])({
                adapter,
                date: newDate,
                minDate: adapter.isBefore(minDate, startOfYear) ? startOfYear : minDate,
                maxDate: adapter.isAfter(maxDate, endOfYear) ? endOfYear : maxDate,
                disablePast,
                disableFuture,
                isDateDisabled,
                timezone
            }) : newDate;
            if (closestEnabledDate) {
                setValueAndGoToNextView(closestEnabledDate, 'finish');
                setVisibleDate({
                    target: closestEnabledDate,
                    reason: 'cell-interaction'
                });
            } else {
                goToNextView();
                setVisibleDate({
                    target: startOfYear,
                    reason: 'cell-interaction'
                });
            }
        }
    }["DateCalendar.DateCalendar.useEventCallback[handleDateYearChange]"]);
    const handleSelectedDayChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$utils$2f$esm$2f$useEventCallback$2f$useEventCallback$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        "DateCalendar.DateCalendar.useEventCallback[handleSelectedDayChange]": (day)=>{
            if (day) {
                // If there is a date already selected, then we want to keep its time
                return handleValueChange((0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$internals$2f$utils$2f$date$2d$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeDateAndTime"])(adapter, day, value ?? referenceDate), 'finish', view);
            }
            return handleValueChange(day, 'finish', view);
        }
    }["DateCalendar.DateCalendar.useEventCallback[handleSelectedDayChange]"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "DateCalendar.DateCalendar.useEffect": ()=>{
            if (adapter.isValid(value)) {
                setVisibleDate({
                    target: value,
                    reason: 'controlled-value-change'
                });
            }
        }
    }["DateCalendar.DateCalendar.useEffect"], [
        value
    ]); // eslint-disable-line
    const classes = useUtilityClasses(classesProp);
    const baseDateValidationProps = {
        disablePast,
        disableFuture,
        maxDate,
        minDate
    };
    const commonViewProps = {
        disableHighlightToday,
        readOnly,
        disabled,
        timezone,
        gridLabelId,
        slots,
        slotProps
    };
    const prevOpenViewRef = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](view);
    __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "DateCalendar.DateCalendar.useEffect": ()=>{
            // If the view change and the focus was on the previous view
            // Then we update the focus.
            if (prevOpenViewRef.current === view) {
                return;
            }
            if (focusedView === prevOpenViewRef.current) {
                setFocusedView(view, true);
            }
            prevOpenViewRef.current = view;
        }
    }["DateCalendar.DateCalendar.useEffect"], [
        focusedView,
        setFocusedView,
        view
    ]);
    const selectedDays = __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DateCalendar.DateCalendar.useMemo[selectedDays]": ()=>[
                value
            ]
    }["DateCalendar.DateCalendar.useMemo[selectedDays]"], [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])(DateCalendarRoot, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(classes.root, className),
        ownerState: ownerState
    }, other, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(CalendarHeader, (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, calendarHeaderProps, {
                slots: slots,
                slotProps: slotProps
            })),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(DateCalendarViewTransitionContainer, {
                reduceAnimations: reduceAnimations,
                className: classes.viewTransitionContainer,
                transKey: view,
                ownerState: ownerState,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    children: [
                        view === 'year' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$YearCalendar$2f$YearCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YearCalendar"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, baseDateValidationProps, commonViewProps, {
                            value: value,
                            onChange: handleDateYearChange,
                            shouldDisableYear: shouldDisableYear,
                            hasFocus: hasFocus,
                            onFocusedViewChange: (isViewFocused)=>setFocusedView('year', isViewFocused),
                            yearsOrder: yearsOrder,
                            yearsPerRow: yearsPerRow,
                            referenceDate: referenceDate
                        })),
                        view === 'month' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$MonthCalendar$2f$MonthCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MonthCalendar"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, baseDateValidationProps, commonViewProps, {
                            currentMonth: calendarState.currentMonth,
                            hasFocus: hasFocus,
                            className: className,
                            value: value,
                            onChange: handleDateMonthChange,
                            shouldDisableMonth: shouldDisableMonth,
                            onFocusedViewChange: (isViewFocused)=>setFocusedView('month', isViewFocused),
                            monthsPerRow: monthsPerRow,
                            referenceDate: referenceDate
                        })),
                        view === 'day' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$mui$2f$x$2d$date$2d$pickers$2f$esm$2f$DateCalendar$2f$DayCalendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DayCalendar"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f40$babel$2f$runtime$2f$helpers$2f$esm$2f$extends$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({}, calendarState, baseDateValidationProps, commonViewProps, {
                            onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
                            hasFocus: hasFocus,
                            onFocusedDayChange: (focusedDate)=>setVisibleDate({
                                    target: focusedDate,
                                    reason: 'cell-interaction'
                                }),
                            reduceAnimations: reduceAnimations,
                            selectedDays: selectedDays,
                            onSelectedDaysChange: handleSelectedDayChange,
                            shouldDisableDate: shouldDisableDate,
                            shouldDisableMonth: shouldDisableMonth,
                            shouldDisableYear: shouldDisableYear,
                            onFocusedViewChange: (isViewFocused)=>setFocusedView('day', isViewFocused),
                            showDaysOutsideCurrentMonth: showDaysOutsideCurrentMonth,
                            fixedWeekNumber: fixedWeekNumber,
                            dayOfWeekFormatter: dayOfWeekFormatter,
                            displayWeekNumber: displayWeekNumber,
                            loading: loading,
                            renderLoading: renderLoading
                        }))
                    ]
                })
            })
        ]
    }));
});
if ("TURBOPACK compile-time truthy", 1) DateCalendar.displayName = "DateCalendar";
("TURBOPACK compile-time truthy", 1) ? DateCalendar.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
   * If `true`, the main element is focused during the first mount.
   * This main element is:
   * - the element chosen by the visible view if any (i.e: the selected day on the `day` view).
   * - the `input` element if there is a field rendered.
   */ autoFocus: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Override or extend the styles applied to the component.
   */ classes: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    className: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * Formats the day of week displayed in the calendar header.
   * @param {PickerValidDate} date The date of the day of week provided by the adapter.
   * @returns {string} The name to display.
   * @default (date: PickerValidDate) => adapter.format(date, 'weekdayShort').charAt(0).toUpperCase()
   */ dayOfWeekFormatter: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * The default selected value.
   * Used when the component is not controlled.
   */ defaultValue: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * If `true`, the component is disabled.
   * When disabled, the value cannot be changed and no interaction is possible.
   * @default false
   */ disabled: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, disable values after the current date for date components, time for time components and both for date time components.
   * @default false
   */ disableFuture: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, today's date is rendering without highlighting with circle.
   * @default false
   */ disableHighlightToday: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, disable values before the current date for date components, time for time components and both for date time components.
   * @default false
   */ disablePast: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, the week number will be display in the calendar.
   */ displayWeekNumber: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * The day view will show as many weeks as needed after the end of the current month to match this value.
   * Put it to 6 to have a fixed number of weeks in Gregorian calendars
   */ fixedWeekNumber: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].number,
    /**
   * Controlled focused view.
   */ focusedView: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'day',
        'month',
        'year'
    ]),
    /**
   * If `true`, calls `renderLoading` instead of rendering the day calendar.
   * Can be used to preload information and show it in calendar.
   * @default false
   */ loading: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * Maximal selectable date.
   * @default 2099-12-31
   */ maxDate: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * Minimal selectable date.
   * @default 1900-01-01
   */ minDate: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * Months rendered per row.
   * @default 3
   */ monthsPerRow: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        3,
        4
    ]),
    /**
   * Callback fired when the value changes.
   * @template TValue The value type. It will be the same type as `value` or `null`. It can be in `[start, end]` format in case of range value.
   * @template TView The view type. Will be one of date or time views.
   * @param {TValue} value The new value.
   * @param {PickerSelectionState | undefined} selectionState Indicates if the date selection is complete.
   * @param {TView | undefined} selectedView Indicates the view in which the selection has been made.
   */ onChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Callback fired on focused view change.
   * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
   * @param {TView} view The new view to focus or not.
   * @param {boolean} hasFocus `true` if the view should be focused.
   */ onFocusedViewChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Callback fired on month change.
   * @param {PickerValidDate} month The new month.
   */ onMonthChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Callback fired on view change.
   * @template TView Type of the view. It will vary based on the Picker type and the `views` it uses.
   * @param {TView} view The new view.
   */ onViewChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Callback fired on year change.
   * @param {PickerValidDate} year The new year.
   */ onYearChange: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * The default visible view.
   * Used when the component view is not controlled.
   * Must be a valid option from `views` list.
   */ openTo: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'day',
        'month',
        'year'
    ]),
    /**
   * If `true`, the component is read-only.
   * When read-only, the value cannot be changed but the user can interact with the interface.
   * @default false
   */ readOnly: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * If `true`, disable heavy animations.
   * @default `@media(prefers-reduced-motion: reduce)` || `navigator.userAgent` matches Android <10 or iOS <13
   */ reduceAnimations: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * The date used to generate the new value when both `value` and `defaultValue` are empty.
   * @default The closest valid date using the validation props, except callbacks such as `shouldDisableDate`.
   */ referenceDate: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * Component displaying when passed `loading` true.
   * @returns {React.ReactNode} The node to render when loading.
   * @default () => <span>...</span>
   */ renderLoading: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Disable specific date.
   *
   * Warning: This function can be called multiple times (for example when rendering date calendar, checking if focus can be moved to a certain date, etc.). Expensive computations can impact performance.
   *
   * @param {PickerValidDate} day The date to test.
   * @returns {boolean} If `true` the date will be disabled.
   */ shouldDisableDate: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Disable specific month.
   * @param {PickerValidDate} month The month to test.
   * @returns {boolean} If `true`, the month will be disabled.
   */ shouldDisableMonth: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * Disable specific year.
   * @param {PickerValidDate} year The year to test.
   * @returns {boolean} If `true`, the year will be disabled.
   */ shouldDisableYear: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
    /**
   * If `true`, days outside the current month are rendered:
   *
   * - if `fixedWeekNumber` is defined, renders days to have the weeks requested.
   *
   * - if `fixedWeekNumber` is not defined, renders day to fill the first and last week of the current month.
   *
   * - ignored if `calendars` equals more than `1` on range pickers.
   * @default false
   */ showDaysOutsideCurrentMonth: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool,
    /**
   * The props used for each component slot.
   * @default {}
   */ slotProps: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * Overridable component slots.
   * @default {}
   */ slots: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */ sx: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOfType([
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
            __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].bool
        ])),
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].func,
        __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object
    ]),
    /**
   * Choose which timezone to use for the value.
   * Example: "default", "system", "UTC", "America/New_York".
   * If you pass values from other timezones to some props, they will be converted to this timezone before being used.
   * @see See the {@link https://mui.com/x/react-date-pickers/timezone/ timezones documentation} for more details.
   * @default The timezone of the `value` or `defaultValue` prop is defined, 'default' otherwise.
   */ timezone: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].string,
    /**
   * The selected value.
   * Used when the component is controlled.
   */ value: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].object,
    /**
   * The visible view.
   * Used when the component view is controlled.
   * Must be a valid option from `views` list.
   */ view: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'day',
        'month',
        'year'
    ]),
    /**
   * Available views.
   */ views: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].arrayOf(__TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'day',
        'month',
        'year'
    ]).isRequired),
    /**
   * Years are displayed in ascending (chronological) order by default.
   * If `desc`, years are displayed in descending order.
   * @default 'asc'
   */ yearsOrder: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        'asc',
        'desc'
    ]),
    /**
   * Years rendered per row.
   * @default 3
   */ yearsPerRow: __TURBOPACK__imported__module__$5b$project$5d2f$web$2d$pacientes$2f$node_modules$2f$prop$2d$types$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].oneOf([
        3,
        4
    ])
} : "TURBOPACK unreachable";
}),
]);

//# sourceMappingURL=3515c_%40mui_x-date-pickers_esm_DateCalendar_fe120176._.js.map