const { trace, context, SpanStatusCode, SpanKind } = require('@opentelemetry/api');

class SpiralMemoryTracing {
    constructor(serviceName = 'spiral-memory') {
        this.serviceName = serviceName;
        this.tracer = trace.getTracer(serviceName, '1.0.0');
    }

    createSpan(operationName, attributes = {}) {
        return this.tracer.startSpan(operationName, {
            kind: SpanKind.INTERNAL,
            attributes: {
                'service.name': this.serviceName,
                'service.version': '1.0.0',
                ...attributes
            }
        });
    }

    async traceMemoryOperation(operationType, memoryId, operation) {
        const span = this.createSpan(`spiral_memory.${operationType}`, {
            'spiral.memory.operation': operationType,
            'spiral.memory.id': memoryId,
            'spiral.memory.timestamp': Date.now()
        });

        try {
            const result = await context.with(trace.setSpan(context.active(), span), operation);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async traceStorageOperation(adapter, operation, key, operationFn) {
        const span = this.createSpan(`storage.${operation}`, {
            'storage.adapter': adapter,
            'storage.operation': operation,
            'storage.key': key,
            'storage.timestamp': Date.now()
        });

        try {
            const result = await context.with(trace.setSpan(context.active(), span), operationFn);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async traceSpiralTopologyCalculation(spiralId, calculationType, operation) {
        const span = this.createSpan('spiral_topology.calculation', {
            'spiral.id': spiralId,
            'spiral.calculation.type': calculationType,
            'spiral.timestamp': Date.now()
        });

        try {
            const result = await context.with(trace.setSpan(context.active(), span), operation);
            span.setStatus({ code: SpanStatusCode.OK });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    async traceCacheOperation(cacheLevel, operation, key, operationFn) {
        const span = this.createSpan(`cache.${operation}`, {
            'cache.level': cacheLevel,
            'cache.operation': operation,
            'cache.key': key,
            'cache.timestamp': Date.now()
        });

        try {
            const result = await context.with(trace.setSpan(context.active(), span), operationFn);
            span.setStatus({ code: SpanStatusCode.OK });
            span.setAttributes({
                'cache.hit': result !== undefined && result !== null
            });
            return result;
        } catch (error) {
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error.message
            });
            span.recordException(error);
            throw error;
        } finally {
            span.end();
        }
    }

    addSpanEvent(eventName, attributes = {}) {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            activeSpan.addEvent(eventName, {
                timestamp: Date.now(),
                ...attributes
            });
        }
    }

    setSpanAttribute(key, value) {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            activeSpan.setAttributes({ [key]: value });
        }
    }

    getCurrentTraceId() {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            return activeSpan.spanContext().traceId;
        }
        return null;
    }

    getCurrentSpanId() {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            return activeSpan.spanContext().spanId;
        }
        return null;
    }

    propagateContext(eventData) {
        const activeSpan = trace.getActiveSpan();
        if (activeSpan) {
            const spanContext = activeSpan.spanContext();
            return {
                ...eventData,
                traceContext: {
                    traceId: spanContext.traceId,
                    spanId: spanContext.spanId,
                    traceFlags: spanContext.traceFlags
                }
            };
        }
        return eventData;
    }

    extractContext(eventData) {
        if (eventData.traceContext) {
            const { traceId, spanId, traceFlags } = eventData.traceContext;
            return trace.setSpanContext(context.active(), {
                traceId,
                spanId,
                traceFlags,
                isRemote: true
            });
        }
        return context.active();
    }
}

module.exports = { SpiralMemoryTracing };
